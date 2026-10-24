const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const mammoth = require('mammoth');
const path = require('path');

const ALLOWED = ['.pdf', '.txt', '.docx', '.csv'];

async function readFileText(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED.includes(ext)) {
    throw new Error('Unsupported file type: ' + ext + '. Please upload PDF, TXT, DOCX or CSV.');
  }

  if (ext === '.pdf') {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  return file.buffer.toString('utf-8');
}

module.exports = { readFileText };