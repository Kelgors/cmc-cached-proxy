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
app.use(rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10 // limit each IP to 5 requests per windowMs
}));

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`CoinMarketCap Cached-Api<br />Prices: update every 30min<br />List 200 first digital assets by marketcap<br />Rate Limit: 10 requests every 5min<br />Available format: csv,json<br />Created by: Kelgors<br /><br />Route: <a href="/quotes/latest.json">/quotes/latest.json</a>`);
  res.end();
});

app.get('/quotes/latest.:format', function (req, res) {
  const { symbols = '', limit = '200' } = req.query;
  const { format = 'json' } = req.params;
  let query = knex('quotes').select()
  if (symbols.trim().length > 0) {
    query.whereIn('symbol', symbols.trim().split(','));
  }
  query.orderBy('cmc_rank', 'asc').limit(Math.min(limit, 200)).then(function (result) {
    res.setHeader('Content-Type', transformers[format].contentType);
    res.send(transformers[format].format(result));
    res.end();
  })
  .catch(function (err) {
    res.send(err);
    res.end();
  });
});


app.listen(process.env.PORT, function () {
  console.info('Server started');
});

process.on('SIGTERM', function () {
  knex.destroy();
  process.exit(0);
});
