const knex = require('knex')(require('../knexfile'));
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const transformers = require('./transformer');

// instances
const app = express();
app.set('trust proxy', 1);
app.use(morgan());
app.use(helmet());

const rateLimit = require('express-rate-limit');

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`CoinMarketCap Cached-Api<br />Prices: update every 30min<br />List 200 first digital assets by marketcap<br />Rate Limit: 5 requests every 15min<br />Created by: Kelgors<br /><br />Route: <a href="/quotes/latest">/quotes/latest</a>`);
  res.end();
});
// create a different rate limiter
app.use('/quotes/latest', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
}));

app.get('/quotes/latest.:format', function (req, res) {
  const { symbols = '', limit = '200' } = req.query;
  const { format = 'json' } = req.params;
  let query = knex('quotes').select()
  if (symbols.trim().length > 0) {
    query.whereIn('symbol', symbols.trim().split(','));
  }
  query.limit(Math.min(limit, 200)).then(function (result) {
    res.setHeader('Content-Type', transformers[format].contentType);
    res.send(transformers[format].format(result));
    res.end();
  })
  .catch(function (err) {
    res.send(err);
    res.end();
  });
});


app.listen(3000, function () {
  console.info('Server started');
});

process.on('SIGTERM', function () {
  knex.destroy();
  process.exit(0);
});
