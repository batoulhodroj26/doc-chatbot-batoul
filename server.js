require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const multer = require('multer');
const { readFileText } = require('./utils/fileReader');

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
    documents.push({ name: req.file.originalname, text });
    res.json({ message: 'Uploaded ' + req.file.originalname, characters: text.length, totalDocuments: documents.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
console.log('API key loaded:', process.env.GOOGLE_API_KEY ? 'yes' : 'no');
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});