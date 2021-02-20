const knex = require('knex')(require('../knexfile'));
const axios = require('axios');
const OUTPUT_CURRENCY = 'USD';

knex('quotes').select('id')
  .then(function (rows) {
    return rows.map(({ id }) => id).join(',');
  })
  .then(function (ids) {
    // fetch
    console.info('Fetching quotes');
    return axios.get(`${process.env.CMC_HOST}/v1/cryptocurrency/quotes/latest`, {
      params: {
        id: ids,
        convert: 'USD',
        skip_invalid: true,
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY
      }
    });
  })
  .then(function (response) {
    console.info('Mapping quotes');
    return Object.values(response.data.data).map(function (item) {
      const { id, name, symbol, slug, circulating_supply, total_supply, max_supply, num_market_pairs, cmc_rank } = item;
      const { price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap, last_updated } = item.quote[OUTPUT_CURRENCY];
      return {
        // basic fields
        id, name, symbol, slug, circulating_supply, total_supply, max_supply, num_market_pairs, cmc_rank,
        // price fields
        price, volume_24h, percent_change_1h, percent_change_24h, percent_change_7d, percent_change_30d, market_cap, last_updated
      }
    });
  })
  .then(function (quotes) {
    console.info(`Inserting ${quotes.length} quotes`);
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
