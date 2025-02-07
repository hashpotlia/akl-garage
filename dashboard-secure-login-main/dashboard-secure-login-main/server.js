const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests
// Load secrets from environment variables
const validPasskeyHash = process.env.VALID_PASSKEY_HASH;
const plainPath = process.env.PLAIN_PATH;
// Route to validate passkey and return the path
app.post('/validate', (req, res) => {
  const { passkey } = req.body;
  // Check if passkey is provided
  if (!passkey) {
    return res.status(400).json({ success: false, message: "Passkey is required." });
  }
  // Hash the provided passkey and compare it
  const crypto = require('crypto');
  const passkeyHash = crypto.createHash('md5').update(passkey).digest('hex');
  if (passkeyHash !== validPasskeyHash) {
    return res.status(401).json({ success: false, message: "Incorrect passkey." });
  }
  // Return the plain path
  return res.json({ success: true, path: plainPath });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
