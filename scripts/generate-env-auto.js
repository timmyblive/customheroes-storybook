const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generateProductionEnv() {
  console.log('🔐 CustomHeroes Production Environment Generator');
  console.log('==============================================\n');
  
  try {
    // Use a secure default password - you can change this later
    const defaultPassword = 'CustomHeroes2024!';
    
    // Generate password hash
    const saltRounds = 12;
    const hash = await bcrypt.hash(defaultPassword, saltRounds);
    
    // Generate JWT secret
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    
    console.log('✅ Production environment variables generated!');
    console.log('\n📋 COPY THESE TO YOUR VERCEL ENVIRONMENT VARIABLES:');
    console.log('=' .repeat(70));
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log('=' .repeat(70));
    
    console.log('\n🔑 DEFAULT ADMIN PASSWORD: CustomHeroes2024!');
    console.log('   (You can change this later using the change-admin-password.js script)');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Go to https://vercel.com/dashboard');
    console.log('2. Select your CustomHeroes project');
    console.log('3. Go to Settings > Environment Variables');
    console.log('4. Add both variables above (copy/paste exactly)');
    console.log('5. Redeploy your application');
    console.log('6. Your admin page will work at https://customheroes.ai/admin');
    
    console.log('\n⚠️  SECURITY NOTES:');
    console.log('• Password: CustomHeroes2024!');
    console.log('• Change this password after first login');
    console.log('• Never commit these values to version control');
    
  } catch (error) {
    console.error('❌ Error generating environment variables:', error);
  }
}

generateProductionEnv();
