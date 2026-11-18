import { createApp } from '../server/app.mjs'
import { serveClient } from '../server/client.mjs'

const port = Number(process.env.MATALENS_BROWSER_PORT ?? 4173)
const { app } = createApp({ uploadsEnabled: true, origin: `http://127.0.0.1:${port}` })
serveClient(app)
app.listen(port, '127.0.0.1')
