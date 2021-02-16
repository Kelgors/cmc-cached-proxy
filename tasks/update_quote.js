const knex = require('knex')(require('../knexfile'));
const axios = require('axios');
const OUTPUT_CURRENCY = 'USD';

knex('quotes').select('symbol')
  .then(function (rows) {
    return rows.map(({ symbol }) => symbol).join(',');
  })
  .then(function (symbols) {
    // fetch
    return axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
      params: {
        symbol: symbols,
        convert: 'USD',
        skip_invalid: true,
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY
      }
    });
  })
  .then(function (response) {
    return Object.values(response.data.data).map(function (item) {
      const { id, name, symbol, slug, circulating_supply, total_supply, max_supply, num_market_pairs, cmc_rank } = item;
      const { price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap } = item.quote[OUTPUT_CURRENCY];
      return {
        // basic fields
        id, name, symbol, slug, circulating_supply, total_supply, max_supply, num_market_pairs, cmc_rank,
        // price fields
        price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap
      }
    });
  })
  .then(function (quotes) {
    return knex('quotes').insert(quotes)
      .onConflict('id')
      .merge();
  })
  .catch(function (err) {
    if (err.response) {
      console.error(err.response.data.status);
    } else {
      console.error(err);
    }
  })
  .then(function () {
    return knex.destroy();
  });
