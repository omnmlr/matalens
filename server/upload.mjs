import Busboy from 'busboy'
import sharp from 'sharp'

export const maxBytes = 8 * 1024 * 1024
export const categories = ['Road or pavement', 'Drainage or flooding', 'Public facility', 'Waste or sanitation', 'Other community issue']
const formats = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }
const inputPixelLimit = 25_000_000

// Keep untrusted input away from decoders outside the intake formats.
sharp.block({ operation: ['VipsForeignLoad'] })
sharp.unblock({ operation: ['VipsForeignLoadJpegBuffer', 'VipsForeignLoadPngBuffer', 'VipsForeignLoadWebpBuffer'] })
const fieldsAllowed = new Set(['kind', 'category', 'description', 'location', 'consent', 'website'])

export class RequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function readUpload(request) {
  if (Number(request.get('content-length')) > maxBytes + 64 * 1024) {
    throw new RequestError(413, 'Choose a photo under 8 MB.')
  }

  return new Promise((resolve, reject) => {
    const fields = Object.create(null)
    const chunks = []
    let mime = ''
    let problem
    let total = 0
    let parser
    try {
      parser = Busboy({
        headers: request.headers,
        limits: { fileSize: maxBytes + 1, files: 1, fields: 6, parts: 8, fieldSize: 4096, fieldNameSize: 40 },
      })
    } catch {
      reject(new RequestError(400, 'Choose a photo and try again.'))
      return
    }

    const tooLarge = () => new RequestError(413, 'Choose a photo under 8 MB.')
    const invalid = () => new RequestError(400, 'Check the report details and try again.')
    const interrupted = () => parser.destroy(invalid())
    const countBytes = (chunk) => {
      total += chunk.length
      if (total > maxBytes + 64 * 1024) parser.destroy(tooLarge())
    }

    request.on('data', countBytes)
    request.once('aborted', interrupted)
    request.once('error', interrupted)
    parser.on('field', (name, value, info) => {
      if (info.nameTruncated || info.valueTruncated || !fieldsAllowed.has(name) || name in fields) {
        problem = invalid()
      } else {
        fields[name] = value.trim()
      }
    })
    parser.on('file', (name, file, info) => {
      if (name !== 'photo' || !Object.hasOwn(formats, info.mimeType)) {
        problem = new RequestError(415, 'Choose a JPG, PNG or WebP photo.')
      }
      mime = info.mimeType
      file.on('data', (chunk) => { if (!problem) chunks.push(chunk) })
      file.on('limit', () => { problem = tooLarge() })
      file.on('error', () => { problem ??= invalid() })
    })
    parser.on('partsLimit', () => { problem = invalid() })
    parser.on('fieldsLimit', () => { problem = invalid() })
    parser.on('filesLimit', () => { problem = invalid() })
    parser.once('error', (error) => { problem = error instanceof RequestError ? error : invalid() })
    parser.once('close', () => {
      request.off('aborted', interrupted)
      request.off('error', interrupted)
      request.off('data', countBytes)
      request.unpipe(parser)
      request.resume()
      if (problem) reject(problem)
      else resolve({ fields, mime, original: Buffer.concat(chunks) })
    })
    request.pipe(parser)
  })
}

export async function validateUpload({ fields, mime, original }) {
  const { kind, category, description = '', location = '', consent, website } = fields
  if (website || consent !== 'yes') {
    throw new RequestError(400, 'Confirm that the photo is safe to share.')
  }
  if (!['community', 'result'].includes(kind)) {
    throw new RequestError(400, 'Choose a report type.')
  }
  if (kind === 'community' && (!categories.includes(category) || description.length < 12)) {
    throw new RequestError(400, 'Choose a category and describe what you saw in at least 12 characters.')
  }
  if (kind === 'result' && location.length < 3) {
    throw new RequestError(400, 'Enter the polling-unit name or code shown on the sheet.')
  }
  if (description.length > 600 || location.length > 140) {
    throw new RequestError(400, 'Shorten the description or location and try again.')
  }
  if (!original.length) throw new RequestError(400, 'Add a photo first.')
  if (original.length > maxBytes) throw new RequestError(413, 'Choose a photo under 8 MB.')

  try {
    const photo = sharp(original, { limitInputPixels: inputPixelLimit, failOn: 'warning' })
    const info = await photo.metadata()
    if (info.format !== formats[mime] || (info.pages ?? 1) !== 1) throw new Error('Unsupported format')
    const preview = await photo.rotate().resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
    return { kind, category: kind === 'result' ? 'Public result sheet' : category, description, location, original, preview }
  } catch {
    throw new RequestError(415, 'Use a readable, still JPG, PNG or WebP photo up to 25 megapixels.')
  }
}
