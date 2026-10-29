# Document Chatbot (RAG)

A web app that lets you upload documents (PDF, TXT, DOCX or CSV) and ask questions about them in a chat. It uses Retrieval-Augmented Generation (RAG): the AI answers only from the content of your uploaded files and shows which document each answer came from.

It is useful for anyone who wants quick answers from long documents, such as reports, assignments, notes or data files, without reading them from start to finish.

## Demo

<!-- Drag your demo video here when editing this file on GitHub -->

1. Upload a document.
2. Ask a question, for example: *"What does this document include?"*
3. The answer appears in the chat, with the source document shown underneath.

## Features

- Upload PDF, TXT, DOCX and CSV files (up to 10 MB each)
- Upload more than one document and ask questions across all of them
- Answers come only from the uploaded files; if something isn't there, the bot says so
- Can summarize a document or explain what it includes
- Shows the source document under each answer
- Answers formatted with Markdown (lists, bold text, headings)
- Loading indicator while the answer is generated
- Clear error messages for unsupported files, empty files, empty questions and server problems
- Conversation history during the session
- Dark / Light mode
- Clear chat
- Clear documents and upload new ones without restarting the app
- Responsive design that works on phones and computers

## Tech Stack

| Part | Technology |
|---|---|
| Backend | Node.js + Express |
| RAG pipeline | LangChain.js (text splitting, MemoryVectorStore) |
| AI | OpenAI API: `text-embedding-3-small` for embeddings, `gpt-4o-mini` for answers |
| File handling | multer (upload), pdf-parse (PDF), mammoth (DOCX) |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5, marked (Markdown) |

## How It Works (RAG)

1. **Upload:** the server reads the file and extracts its text.
2. **Split:** the text is split into small overlapping pieces (chunks of 1000 characters, overlapping by 150).
3. **Embed and store:** each chunk is turned into numbers (embeddings) by OpenAI and saved in the Memory Vector Store.
4. **Search:** when a question is asked, the app finds the 6 chunks most similar to the question.
5. **Answer:** those chunks are sent to `gpt-4o-mini` with instructions to answer using only them. The answer is returned with the names of the source documents.

```
Document → Extract text → Split into chunks → Embeddings → Memory Vector Store
                                                                  ↓
Question → Embedding → Find most similar chunks → gpt-4o-mini → Answer + Source
```

## Setup Instructions

### Requirements
- Node.js 18 or newer
- An OpenAI API key with available credit

### Steps

1. Clone the repository:
   ```
   git clone https://github.com/batoulhodroj26/doc-chatbot-batoul.git
   cd doc-chatbot-batoul
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Get an API key from https://platform.openai.com/api-keys
4. Create a file named `.env` in the project folder:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
5. Start the server:
   ```
   node server.js
   ```
   You should see:
   ```
   API key loaded: yes
   Server running on http://localhost:3000
   ```
6. Open http://localhost:3000 in your browser.

## How to Use

1. Click **Choose File**, select a PDF, TXT, DOCX or CSV file, and click **Upload**.
2. Wait for the success message showing how many characters were read.
3. Type a question in the box at the bottom and click **Send**.
4. Read the answer and the source shown under it.
5. Use **Clear chat** to empty the conversation, **Clear documents** to remove all uploaded files, and **Dark mode** to switch the theme.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload a file (form field `file`). Returns the file name, character count and number of documents loaded. |
| POST | `/api/chat` | Ask a question. Body: `{ "question": "..." }`. Returns `{ "answer": "...", "sources": [...] }`. |
| POST | `/api/clear-documents` | Remove all uploaded documents. |

## Project Structure

```
doc-chatbot-batoul/
├── public/
│   ├── index.html    (chat interface)
│   ├── style.css     (styles and dark mode)
│   └── app.js        (frontend logic: upload, chat, theme, clear buttons)
├── utils/
│   ├── fileReader.js (extracts text from PDF, TXT, DOCX, CSV)
│   └── rag.js        (RAG logic: splitting, embeddings, search, answers)
├── server.js         (Express server and API routes)
├── .env              (API key, not uploaded to GitHub)
├── package.json
└── README.md
```

## Troubleshooting

| Problem | Solution |
|---|---|
| `API key loaded: no` | Check that `.env` is in the project folder and contains `OPENAI_API_KEY=...` |
| "Something went wrong while generating the answer." | Check that your API key is valid and your OpenAI account has credit. Look at the terminal for the full error. |
| "Please upload a document first." | Documents are kept in memory and are cleared when the server restarts. Upload the file again. |
| Code changes don't take effect | Stop the server with `Ctrl + C` and start it again with `node server.js`. |
| `EADDRINUSE: port 3000` | Another copy of the server is already running. Close it, or stop the other `node` process. |
| "Unsupported file type" | Only PDF, TXT, DOCX and CSV files are supported. |

## Limitations

- Documents are stored in memory, so they are lost when the server restarts.
- Scanned PDFs (images of text) can't be read, because the app doesn't do OCR.
- The maximum file size is 10 MB.

## Author

Batoul Hodroj
