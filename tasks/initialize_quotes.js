const knex = require('knex')(require('../knexfile'));
const axios = require('axios');

console.info('Fetch data from cmc');
Promise.resolve()
.then(function () {
  return axios.get(`${process.env.CMC_HOST}/v1/cryptocurrency/listings/latest`, {
    params: {
      limit: process.env.MARKET_DEPTH || '100',
      convert: 'USD',
      aux: 'num_market_pairs,cmc_rank,max_supply,circulating_supply,total_supply'
    },
    headers: {
      'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY
    }
  });
})
.then(function (response) {
  console.info('Parsing data', response.data.data);
  return response.data.data.map(function (item) {
    const { id, name, symbol, slug, cmc_rank, num_market_pairs, circulating_supply, total_supply, max_supply, last_updated } = item;
    return { id, name, symbol, slug, cmc_rank, num_market_pairs, circulating_supply, total_supply, max_supply, last_updated };
  });
})
.then(function (rows) {
  console.info('Inserting in DB');
  return knex('quotes').insert(rows).onConflict('id').merge();
})
.catch((err) => {
  if (err.response) {
    console.error(err.response.status);
  } else {
    console.error(err);
  }
})
.then(function () {
  return knex.destroy();
});
