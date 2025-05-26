const bcrypt = require('bcryptjs');

// Create a new hash for "admin123"
async function createHash() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('New hash for "admin123":', hash);
    console.log('\nAdd this to your .env.development.local file:');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
    console.log('\nNote: We\'re wrapping the hash in double quotes to prevent any parsing issues');
  } catch (error) {
    console.error('Error creating hash:', error);
  }
}

createHash();
