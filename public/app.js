const chatBox = document.getElementById('chatBox');
const chatForm = document.getElementById('chatForm');
const questionInput = document.getElementById('questionInput');

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = 'message ' + (sender === 'user' ? 'user-msg' : 'ai-msg');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();

  if (!question) {
    addMessage('Please type a question first.', 'ai');
    return;
  }

  addMessage(question, 'user');
  questionInput.value = '';
  addMessage('(The AI answer will appear here later.)', 'ai');
});
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = fileInput.files[0];

  if (!file) {
    uploadStatus.textContent = 'Please choose a file first.';
    uploadStatus.className = 'small mt-2 text-danger';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  uploadStatus.textContent = 'Uploading ' + file.name + '...';
  uploadStatus.className = 'small mt-2 text-muted';

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      uploadStatus.textContent = data.error;
      uploadStatus.className = 'small mt-2 text-danger';
      return;
    }

    uploadStatus.textContent = data.message + ' (' + data.characters + ' characters). Documents loaded: ' + data.totalDocuments;
    uploadStatus.className = 'small mt-2 text-success';
    fileInput.value = '';
  } catch (err) {
    uploadStatus.textContent = 'Upload failed. Is the server running?';
    uploadStatus.className = 'small mt-2 text-danger';
  }
});