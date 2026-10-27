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

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();

  if (!question) {
    addMessage('Please type a question first.', 'ai');
    return;
  }

  addMessage(question, 'user');
  questionInput.value = '';

  const loading = addMessage('Thinking...', 'ai');
  loading.classList.add('loading');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    loading.remove();

    if (!res.ok) {
      addMessage(data.error, 'ai');
      return;
    }

    const answer = addMessage(data.answer, 'ai');
    answer.innerHTML = marked.parse(data.answer);
    if (data.sources && data.sources.length) {
      const src = document.createElement('div');
      src.className = 'source small mt-2';
      src.textContent = 'Source: ' + data.sources.join(', ');
      answer.appendChild(src);
    }
  } catch (err) {
    loading.remove();
    addMessage('Could not reach the server. Please try again.', 'ai');
  }
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
const themeBtn = document.getElementById('themeBtn');
const clearChatBtn = document.getElementById('clearChatBtn');

themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-bs-theme') === 'dark';
  html.setAttribute('data-bs-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? 'Dark mode' : 'Light mode';
});

clearChatBtn.addEventListener('click', () => {
  chatBox.innerHTML = '';
});
   const docList = document.getElementById('docList');
   const clearDocsBtn = document.getElementById('clearDocsBtn');

   function showDocuments(names) {
     docList.innerHTML = '';
     names.forEach(name => {
       const li = document.createElement('li');
       li.textContent = name;
       docList.appendChild(li);
     });
   }

   clearDocsBtn.addEventListener('click', async () => {
     await fetch('/api/clear-documents', { method: 'POST' });
     showDocuments([]);
     uploadStatus.textContent = 'All documents cleared. Upload a new document to continue.';
     uploadStatus.className = 'small mt-2 text-muted';
   });