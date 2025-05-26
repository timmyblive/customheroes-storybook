const bcrypt = require('bcryptjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function changePassword() {
  // Get the new password
  rl.question('Enter your new admin password: ', async (password) => {
    if (!password || password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      rl.close();
      return;
    }

    // Confirm the password
    rl.question('Confirm your new password: ', async (confirmPassword) => {
      if (password !== confirmPassword) {
        console.log('❌ Passwords do not match');
        rl.close();
        return;
      }

      try {
        // Generate the hash
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        
        console.log('\n✅ Password hash generated successfully!');
        console.log('\nNew password hash:');
        console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
        
        // Ask if they want to update the development environment file
        rl.question('\nDo you want to update your .env.development.local file with this new password? (y/n): ', (answer) => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            try {
              const envFilePath = path.join(process.cwd(), '.env.development.local');
              
              if (fs.existsSync(envFilePath)) {
                let envContent = fs.readFileSync(envFilePath, 'utf8');
                
                // Replace the existing ADMIN_PASSWORD_HASH line or add it if it doesn't exist
                if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
                  envContent = envContent.replace(
                    /ADMIN_PASSWORD_HASH=.*/,
                    `ADMIN_PASSWORD_HASH="${hash}"`
                  );
                } else {
                  envContent += `\nADMIN_PASSWORD_HASH="${hash}"\n`;
                }
                
                fs.writeFileSync(envFilePath, envContent);
                console.log('\n✅ .env.development.local file updated successfully!');
                console.log('\n⚠️ Remember to restart your development server for changes to take effect!');
              } else {
                console.log('\n❌ .env.development.local file not found.');
              }
            } catch (error) {
              console.error('\n❌ Error updating .env file:', error);
            }
          } else {
            console.log('\nFor production, add this to your environment variables:');
            console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
          }
          
          rl.close();
        });
      } catch (error) {
        console.error('❌ Error generating password hash:', error);
        rl.close();
      }
    });
  });
}

changePassword();
