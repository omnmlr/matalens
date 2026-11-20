import { Router } from 'express'
import { isId } from './model.ts'
import { createEditionReader, defaultEdition } from './storage.ts'

export function storyRoutes(editionPath = defaultEdition) {
  const router = Router()
  const readEdition = createEditionReader(editionPath)
  router.get('/', (req, res) => {
    const filter = req.query.personId
    if (filter !== undefined && !isId(filter)) return res.status(400).json({ error: 'Use one valid personId.' })
    try {
      const stories = readEdition()
      return res.json(filter === undefined ? stories : stories.filter(story => story.personIds.includes(filter)))
    } catch {
      return res.status(503).json({ error: 'The reviewed story edition is temporarily unavailable.' })
    }
  })
  router.get('/:id', (req, res) => {
    if (!isId(req.params.id)) return res.status(404).json({ error: 'Story unavailable.' })
    try {
      const story = readEdition().find(item => item.id === req.params.id)
      return story ? res.json(story) : res.status(404).json({ error: 'Story unavailable.' })
    } catch {
      return res.status(503).json({ error: 'The reviewed story edition is temporarily unavailable.' })
    }
  })
  return router
}
