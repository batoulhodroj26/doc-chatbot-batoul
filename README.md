# Document Chatbot (RAG)

This app lets users upload documents (PDF, TXT, DOCX or CSV) and ask questions about them by typing in the chat. The AI answers only from the content of the uploaded files.

## Features
- Upload PDF, TXT, DOCX and CSV files
- Upload more than one document
- Ask questions and get answers about anything in the files
- Shows the source document under each answer
- Loading indicator while the answer is generated
- Error messages for unsupported files and empty questions
- Conversation history during the session
- Dark / Light mode
- Clear chat
- Clear documents and upload new ones without restarting the app
- Responsive design that works on phones and computers

## Tech Stack
- Node.js + Express (backend)
- LangChain.js (text splitting, MemoryVectorStore)
- OpenAI API (text-embedding-3-small for embeddings, gpt-4o-mini for answers)
- Bootstrap 5 (responsive interface)
- multer, pdf-parse, mammoth (file upload and reading)

## How It Works (RAG)
1. When a document is uploaded, it is split into small pieces (chunks).
2. Each piece is turned into numbers (embeddings) and stored in the Memory Vector Store.
3. When a question is asked, the app searches the stored pieces and finds the ones most similar to the question.
4. These pieces are sent to the AI (gpt-4o-mini), which answers using only them.

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
4. Get an API key from https://platform.openai.com/api-keys
5. Create a file named `.env` in the project folder:
   ```
   OPENAI_API_KEY=your_api_key_here
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
│   ├── index.html    (chat interface)
│   ├── style.css     (styles)
│   └── app.js        (frontend logic)
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