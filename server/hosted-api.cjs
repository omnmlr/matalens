module.exports = function createReadOnlyApi(stories) {
  const validId = value => value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  const unavailable = 'Photo intake and private receipt access require persistent storage and are unavailable on this deployment.'

  return (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    const json = (status, body) => res.status(status).json(body)
    const url = new URL(req.url, 'http://matalens.invalid')
    const path = url.pathname

    if (req.headers['sec-fetch-site'] === 'cross-site') {
      return json(403, { error: 'Open this action directly in MataLens.' })
    }
    const read = req.method === 'GET' || req.method === 'HEAD'
    if (read && path === '/api/intake') return json(200, { uploadsEnabled: false, retentionDays: 30, reason: 'persistent-storage-unavailable' })
    if (read && path === '/api/stories') {
      const filters = url.searchParams.getAll('personId')
      if (filters.length > 1 || (filters.length && !validId(filters[0]))) {
        return json(400, { error: 'Use one valid personId.' })
      }
      return json(200, filters.length ? stories.filter(story => story.personIds.includes(filters[0])) : stories)
    }
    if (read && path.startsWith('/api/stories/')) {
      const id = path.slice('/api/stories/'.length)
      const story = validId(id) && stories.find(item => item.id === id)
      return story ? json(200, story) : json(404, { error: 'Story unavailable.' })
    }
    if (path === '/api/reports' || path === '/api/receipt' || path === '/api/receipt/photo') {
      return json(503, { error: unavailable })
    }
    return json(404, { error: 'This MataLens action is unavailable.' })
  }
}
