const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('@langchain/google-genai');

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-embedding-001'
});

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-3.8-flash',
  temperature: 0
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });

let vectorStore = new MemoryVectorStore(embeddings);

async function addDocument(name, text) {
  const chunks = await splitter.createDocuments([text], [{ source: name }]);
  await vectorStore.addDocuments(chunks);
  return chunks.length;
}

async function askQuestion(question) {
  const results = await vectorStore.similaritySearch(question, 4);

  if (results.length === 0) {
    return { answer: 'Please upload a document first.', sources: [] };
  }

  const context = results
    .map((doc, i) => `[${i + 1}] (from ${doc.metadata.source})\n${doc.pageContent}`)
    .join('\n\n');

  const prompt = `You are a helpful assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say: "I couldn't find that in the uploaded documents."

Context:
${context}

Question: ${question}
Answer:`;

  const response = await llm.invoke(prompt);
  const sources = [...new Set(results.map(doc => doc.metadata.source))];

  return { answer: response.content, sources };
}

function clearDocuments() {
  vectorStore = new MemoryVectorStore(embeddings);
}

module.exports = { addDocument, askQuestion, clearDocuments };