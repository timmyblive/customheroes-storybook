const bcrypt = require('bcryptjs');

// The password we want to test
const testPassword = 'admin123';

// The hash from our environment
const storedHash = '$2b$12$75v8OFvqWCKro67Wf1ECsuZ6FmKs8u84ASp5dlVybc3/T/Xd1KMmG';

// Test the password against the hash
bcrypt.compare(testPassword, storedHash)
  .then(isMatch => {
    console.log('Password verification result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match the stored hash.');
      console.log('Let\'s generate a new hash for this password:');
      return bcrypt.hash(testPassword, 12);
    }
  })
  .then(newHash => {
    if (newHash) {
      console.log('\nNew hash for "admin123":', newHash);
      console.log('\nUpdate your .env.development.local file with this hash if needed.');
    }
  })
  .catch(err => {
    console.error('Error during password verification:', err);
  });
