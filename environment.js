const fs = require('fs');
const dotenv = require('dotenv');
try {
  const envConfig = dotenv.parse(fs.readFileSync(`./.env.${process.env.NODE_ENV || 'development'}`))
  // override existing variables
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
} catch (err) {}
if (!typeof process.env.MAX_COIN) {
  console.info('Set default value for MAX_COIN to 400');
  process.env.MAX_COIN = 400;
}
if (!typeof process.env.MARKET_DEPTH) {
  process.env.MARKET_DEPTH = 100;
}
[ 'CMC_APIKEY', 'CMC_HOST', 'DATABASE_URL' ].forEach(function (key) {
  if (!process.env[key]) {
    throw new Error(`MissingEnvProperty(name: ${key})`);
  }
});
