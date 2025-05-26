const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generatePasswordHash() {
  rl.question('Enter your desired admin password: ', async (password) => {
    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      rl.close();
      return;
    }

    try {
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);
      
      console.log('\n✅ Password hash generated successfully!');
      console.log('\nAdd this to your .env.local file:');
      console.log(`ADMIN_PASSWORD_HASH=${hash}`);
      console.log('\nAlso add a JWT secret:');
      console.log(`JWT_SECRET=${generateRandomSecret()}`);
      console.log('\n⚠️  Keep these values secure and never commit them to version control!');
      
    } catch (error) {
      console.error('❌ Error generating password hash:', error);
    }
    
    rl.close();
  });
}

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

generatePasswordHash();
