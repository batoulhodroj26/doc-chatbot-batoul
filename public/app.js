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