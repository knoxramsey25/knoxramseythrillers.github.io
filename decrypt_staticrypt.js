const fs = require('fs');
const crypto = require('crypto');

// Read the encrypted HTML file
const html = fs.readFileSync('fieldguide/bonus.html', 'utf8');

// Extract the staticrypt configuration
const configMatch = html.match(/staticryptConfig = ({[^;]+});/);
if (!configMatch) {
  console.error('Could not find staticrypt configuration');
  process.exit(1);
}

const config = JSON.parse(configMatch[1]);
const encryptedMsg = config.staticryptEncryptedMsgUniqueVariableName;
const salt = config.staticryptSaltUniqueVariableName;
const password = 'GENEVA204';

console.log('Found encrypted content and salt');
console.log('Salt:', salt);
console.log('Attempting decryption...');

// Implement the same hashing as staticrypt
async function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

async function decrypt(encryptedMsg, hashedPassword) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(hashedPassword, 'hex'),
    Buffer.alloc(12, 0)
  );
  
  // Split HMAC and actual encrypted content
  const encryptedHMAC = encryptedMsg.substring(0, 64);
  const actualEncrypted = encryptedMsg.substring(64);
  
  try {
    const decrypted = decipher.update(actualEncrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    return null;
  }
}

(async () => {
  try {
    const hashedPassword = await hashPassword(password, salt);
    console.log('Password hashed');
    
    const decrypted = await decrypt(encryptedMsg, hashedPassword);
    
    if (decrypted) {
      fs.writeFileSync('fieldguide/bonus_source.html', decrypted);
      console.log('\nSuccess! Decrypted content saved to fieldguide/bonus_source.html');
    } else {
      console.error('\nDecryption failed - wrong password or algorithm mismatch');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
