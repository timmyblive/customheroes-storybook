const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate password hash for "admin123"
const password = 'admin123';
const hash = bcrypt.hashSync(password, 12);
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('🔐 Admin Authentication Setup');
console.log('=============================');
console.log('');
console.log('Add these to your .env.local file:');
console.log('');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('🔑 Test credentials:');
console.log('Password: admin123');
console.log('');
console.log('⚠️  Remember to change the password in production!');
