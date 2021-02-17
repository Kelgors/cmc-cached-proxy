global.knex = require('knex')(require('../knexfile'));
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

// instances
const app = express();
app.set('trust proxy', 1);
app.use(morgan());
app.use(helmet());

// index route
app.get('/', function (req, res) {
  knex('quotes').select('symbol', 'name')
    .orderBy('cmc_rank', 'asc')
    .then(function (rows) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(`<h1>CoinMarketCap Cached-Api</h1><br />
Prices: update every 30min<br />
Rate Limit: 10 requests every 5min<br />
Available format: csv,json<br />
Created by: Kelgors<br /><br />
API Quotes: <a href="/quotes/latest.json">/quotes/latest.json</a><br /><br />
<h3>Coin list (${rows.length})</h3>
<ol>
${rows.map(({ symbol, name }) => `<li>${name} (${symbol})</li>`).join('\n')}
</ol>
`);
      res.end();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occured');
      res.end();
    });
});

app.use('/admin/quotes', require('./routers/Admin.js'));
app.use(require('./routers/LatestQuotes.js'));

app.listen(process.env.PORT, function () {
  console.info('Server started');
});

process.on('SIGTERM', function () {
  global.knex.destroy();
  process.exit(0);
});
