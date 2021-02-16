const fs = require('fs');
const dotenv = require('dotenv');
try {
  const envConfig = dotenv.parse(fs.readFileSync(`./.env.${process.env.NODE_ENV || 'development'}`))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
} catch (err) {}
