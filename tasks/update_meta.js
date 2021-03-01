const knex = require('knex')(require('../knexfile'));
const axios = require('axios');
const { get, join } = require('lodash');

knex('quotes').select([ 'id', 'cmc_rank' ])
  .orderBy('cmc_rank', 'asc')
  .limit(process.env.MAX_COIN)
  .then(function (rows) {
    return rows.map(({ id }) => id).join(',');
  })
  .then(function (ids) {
    // fetch
    console.info('Fetching crypto info');
    return axios.get(`${process.env.CMC_HOST}/v1/cryptocurrency/info`, {
      params: {
        id: ids,
        aux: 'urls,description,tags,platform,status'
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY
      }
    });
  })
  .then(function (response) {
    const data = response.data.data || {};
    const ids = Object.keys(data);
    console.info(`${ids.length} info received`);
    console.info('Mapping...');
    const output = [];
    for (let index = 0; index < ids.length; index++) {
      const id = Number(ids[index]);
      const item = data[id];
      if (!item) continue;
      const { platform, tags, description, category, urls } = item;
      output.push({
        id,
        platform: get(platform, 'name'),
        tags: join(tags, ','),
        description,
        category,
        website: get(urls, 'website.0'),
        technical_doc: get(urls, 'technical_doc.0'),
      });
    }
    return output;
  })
  .then(function (rows) {
    return knex('quotes')
      .insert(rows)
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
