require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
console.log('API key loaded:', process.env.GOOGLE_API_KEY ? 'yes' : 'no');
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});