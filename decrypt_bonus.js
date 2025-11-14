const fs = require('fs');
const crypto = require('crypto');

// Read the encrypted file
const html = fs.readFileSync('fieldguide/bonus.html', 'utf8');

// Extract the encrypted content and salt from the HTML
const saltMatch = html.match(/const salt = "([^"]+)"/);
const encryptedMatch = html.match(/const encryptedData = "([^"]+)"/);

if (!saltMatch || !encryptedMatch) {
  console.error('Could not find salt or encrypted data in the file');
  process.exit(1);
}

const salt = saltMatch[1];
const encryptedData = encryptedMatch[1];
const password = 'GENEVA204';

// Decrypt using the same algorithm staticrypt uses
try {
  const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.alloc(16, 0));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, 'base64')),
    decipher.final()
  ]);
  
  fs.writeFileSync('fieldguide/bonus_source.html', decrypted.toString());
  console.log('Successfully decrypted to bonus_source.html');
} catch (err) {
  console.error('Decryption failed:', err.message);
  process.exit(1);
}
