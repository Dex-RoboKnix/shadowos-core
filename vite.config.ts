import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'shadow-sync-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/sync' && req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const data = JSON.parse(body)
                const dataDir = path.resolve(__dirname, '../shadow_os_data')
                const targetPath = path.join(dataDir, data.path || 'default.md')
                
                if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
                
                fs.writeFileSync(targetPath, data.content, 'utf-8')
                
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'success', saved: targetPath }))
              } catch (e) {
                res.statusCode = 500
                res.end(JSON.stringify({ status: 'error', message: e instanceof Error ? e.message : 'Unknown error' }))
              }
            })
          } else {
            next()
          }
        })
      }
    }
  ],
})
