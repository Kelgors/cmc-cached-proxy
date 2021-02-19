const { pick } = require('lodash');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();

router.use(cors());

const ADMIN_API_KEYS = process.env.ADMIN_API_KEYS.split(',');

router.use(express.json());
router.use(function (req, res, next) {
  const apikey = req.headers['x-api-key'] || req.query['apikey'];
  if (ADMIN_API_KEYS.includes(apikey)) {
    next();
  } else {
    res.status(403);
    res.send('Unauthorized!');
    res.end();
  }
});

// Fetch from cmc with symbol
router.get('/cmc', function (req, res) {
  const { symbols } = req.query;
  if (!(symbols || '').trim()) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify({ data: null, success: false }));
    res.end();
    return;
  }
  return axios.get(`${process.env.CMC_HOST}/v1/cryptocurrency/quotes/latest`, {
    params: {
      symbol: symbols,
      convert: 'USD',
      aux: ''
    },
    headers: {
      'X-CMC_PRO_API_KEY': process.env.CMC_APIKEY
    }
  })
  .then(function (response) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify({ data: response.data.data }));
    res.end();
  })
  .catch(function (err) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify({ success: false, message: err.response.data.status }));
    res.end();
  })
});

// List
router.get('/', function (req, res) {
  return knex('quotes').select().orderBy('cmc_rank', 'asc')
    .then(function (rows) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(JSON.stringify({ data: rows }));
      res.end();
    });
});

// Item
router.get('/:id', function (req, res) {
  return knex('quotes').first().where('id', '=', req.params.id)
    .then(function (row) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(JSON.stringify({ data: row }));
      res.end();
    });
});

// Create
router.post('/', function (req, res) {
  const row = pick(req.body, [ 'id', 'name', 'slug', 'symbol' ]);
  return knex('quotes').count()
    .then(function ([ { count } ]) {
      console.info(`Coins: ${count}/400`);
      if (count >= 400) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send('{"data":null,"success":false,"message":"Too much coins. 400 coins limit reached"}');
        res.end();
      }
      return knex('quotes').insert(row)
        .returning('*')
        .then(function ([ row ]) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.send(JSON.stringify({ data: row }));
          res.end();
        })
        .catch(function (err) {
          res.end(err.message);
        });
    })

});

// Delete
router.delete('/:id', function (req, res) {
  return knex('quotes').delete().where('id', '=', req.params.id)
    .then(function (count) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(JSON.stringify({ data: null, success: count > 0 }));
      res.end();
    });
});


module.exports = router;
