const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small'
});

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0,
  maxRetries: 1
});

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });

let vectorStore = new MemoryVectorStore(embeddings);

async function addDocument(name, text) {
  const chunks = await splitter.createDocuments([text], [{ source: name }]);
  await vectorStore.addDocuments(chunks);
  return chunks.length;
}

async function askQuestion(question) {
  const results = await vectorStore.similaritySearch(question, 6);

  if (results.length === 0) {
    return { answer: 'Please upload a document first.', sources: [] };
  }

  const context = results
    .map((doc, i) => `[${i + 1}] (from ${doc.metadata.source})\n${doc.pageContent}`)
    .join('\n\n');

  const prompt = `You are a helpful assistant. Answer the question using ONLY the context below, which comes from the user's uploaded documents.
If the user asks what the document is about, what it includes, or for a summary, describe and summarize the context.
Only if the question asks for specific information that is not in the context, say: "I couldn't find that in the uploaded documents."

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