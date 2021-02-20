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
Prices: update every 20min<br />
Rate Limit: 10 requests every 5min<br />
Available format: csv,json<br />
Sources: <a href="https://github.com/Kelgors/cmc-cached-proxy" target="_blank" rel="noopener noreferrer">GitHub</a><br />
<div>
  <h3>Donations</h3>
  <ul>
    <li>LTC: ltc1qg3qvxm3j2hcwraf3dkahwjqdx8t803uejf5y9n</li>
    <li>DOGE: DAMtNpASBe7HzkQ5JvC7GTYBs1F1qa8mgi</li>
  </ul>
</div>
<h3>Routes</h3>
<ul>
  <li>Quotes: <a href="/quotes/latest.json">/quotes/latest.json</a></li>
</ul>
<div>
  <h3>Query parameters</h3>
  <table border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Format</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>pretty</td>
        <td>Boolean</td>
        <td>JSON</td>
        <td>Display json incremeted by spaces if pretty = 1</td>
      </tr>
      <tr>
        <td>separator</td>
        <td>String</td>
        <td>CSV</td>
        <td>Define the CSV column separator (default: ,)</td>
      </tr>
      <tr>
        <td>fields</td>
        <td>String[]</td>
        <td>Both</td>
        <td>Define which fields will be rendered. You can order your columns with this parameters in CSV format.<br />
          Default values = id,name,symbol,slug,circulating_supply,total_supply,max_supply,num_market_pairs,cmc_rank,<br />
          price,volume_24h,percent_change_1h,percent_change_24h,percent_change_7d,percent_change_30d,market_cap,<br />
          last_updated,category,platform,description,tags,website,technical_doc,icon
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div>
  <h3>Examples</h3>
  <ul>
  <li><a href="/quotes/latest.json?pretty=1" target="_blank" rel="noopener noreferrer">Pretty json with all information</a></li>
  <li><a href="/quotes/latest.json?pretty=1&fields=id,name,symbol,slug,description,price" target="_blank" rel="noopener noreferrer">Pretty json with coin info</a></li>
  <li><a href="/quotes/latest.json?separator=%2C&fields=id,name,symbol,slug,description,price" target="_blank" rel="noopener noreferrer">CSV separator by comma with basic coin info</a></li>
</ul>
</div>
<h3>Coin list (${rows.length}/400)</h3>
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
