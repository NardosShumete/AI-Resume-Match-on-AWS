import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenAI } from '@google/genai'

// Custom Vite plugin to handle /api/gemini requests
const geminiProxyPlugin = (env: Record<string, string>) => {
  // Create the Gemini AI client using the loaded env variable
  const ai = new GoogleGenAI({ apiKey: env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '' })
  
  return {
    name: 'gemini-proxy',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/gemini' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              const prompt = data.prompt;

              if (!prompt) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Prompt is required' }));
              }

              // Call Gemini
              const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(response.text); // Since we requested JSON, response.text should be a JSON string
            } catch (error: any) {
              console.error('Gemini API Error:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to generate content' }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), geminiProxyPlugin(env)],
  }
})
