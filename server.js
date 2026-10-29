require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { readFileText } = require('./utils/fileReader');
const { addDocument, askQuestion, clearDocuments } = require('./utils/rag');

const app = express();
const PORT = 3000;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const documents = [];

app.use(express.static('public'));
app.use(express.json());

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }
    const text = await readFileText(req.file);
    if (!text.trim()) {
      return res.status(400).json({ error: 'The file is empty or has no readable text.' });
    }
    const chunkCount = await addDocument(req.file.originalname, text);
    documents.push({ name: req.file.originalname, chunks: chunkCount });
    res.json({
      message: 'Uploaded ' + req.file.originalname,
      characters: text.length,
      totalDocuments: documents.length,
      documents: documents.map(d => d.name)
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const question = (req.body.question || '').trim();
    if (!question) {
      return res.status(400).json({ error: 'Question cannot be empty.' });
    }
    if (documents.length === 0) {
      return res.status(400).json({ error: 'Please upload a document first.' });
    }
    const result = await askQuestion(question);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while generating the answer.' });
  }
});

app.post('/api/clear-documents', (req, res) => {
  clearDocuments();
  documents.length = 0;
  res.json({ message: 'All documents cleared.' });
});

console.log('API key loaded:', process.env.OPENAI_API_KEY ? 'yes' : 'no');

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});