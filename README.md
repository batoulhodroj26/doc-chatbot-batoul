# Document Chatbot (RAG)

✏️ Write 2–3 sentences: what the app does and who it is for.

## Features
✏️ List what your app can do, one per line, starting with "- ".
(Think: upload, file types, answers from the document, sources, multiple documents, dark mode, clear chat, clear documents, loading indicator, error handling.)

## Tech Stack
- Node.js + Express (backend)
- LangChain.js (text splitting, MemoryVectorStore)
- Google Gemini API (embeddings + answers)
- Bootstrap 5 (responsive interface)
- multer, pdf-parse, mammoth (file upload and reading)

## How It Works (RAG)
✏️ Explain in 3–4 steps what happens when a document is uploaded and a question is asked.
(Remember: split → embeddings → store → search similar chunks → AI answers only from them.)

## Setup Instructions

1. Install Node.js (version 18 or newer).
2. Clone the repository:
   ```
   git clone https://github.com/batoulhodroj26/doc-chatbot-batoul.git
   cd doc-chatbot-batoul
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Get a free API key from https://aistudio.google.com/apikey
5. Create a file named `.env` in the project folder:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
6. Start the server:
   ```
   node server.js
   ```
7. Open http://localhost:3000 in your browser.

## Project Structure
```
doc-chatbot-batoul/
├── public/
│   ├── index.html   (chat interface)
│   ├── style.css    (styles)
│   └── app.js       (frontend logic)
├── utils/
│   ├── fileReader.js (reads PDF, TXT, DOCX, CSV)
│   └── rag.js        (RAG logic with LangChain)
├── server.js         (Express server and API routes)
├── .env              (API key, not uploaded)
└── package.json
```

## Notes
- Documents are stored in memory, so they are cleared when the server restarts.
- Supported formats: PDF, TXT, DOCX, CSV (max 10 MB).