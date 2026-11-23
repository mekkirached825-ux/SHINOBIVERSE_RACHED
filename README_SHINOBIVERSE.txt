SHINOBIVERSE

Files:
- shinobiverse.html: frontend
- server.js: Node.js server and API proxy
- package.json: start command and Node version
- render.yaml: deployment settings

Deploy:
1. Upload these files to the GitHub repository root (not inside a nested folder).
2. Create a web service on Render connected to the repository.
3. Runtime: Node. Build command: npm install. Start command: npm start.
4. Optional AI connection: set AI_API_URL, AI_API_KEY, and AI_MODEL as environment variables in the host dashboard. Use an API provider that supports the OpenAI-compatible chat-completions request shape. Never put keys in the HTML or commit them to GitHub.
5. The site can deploy without an AI key, but chat replies will explain that AI service is not configured.

Safety/privacy: This is a fictional character chat. Do not collect sensitive personal information.
