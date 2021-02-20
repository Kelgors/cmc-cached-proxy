const express = require('express');
const rateLimit = require('express-rate-limit');
const transformers = require('../transformer');
const router = express.Router();

router.use(rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10 // limit each IP to 5 requests per windowMs
}));

router.get('/quotes/latest.:format', function (req, res) {
  const { symbols = '', limit = '200' } = req.query;
  const { format = 'json' } = req.params;
  let query = knex('quotes').select()
  if (symbols.trim().length > 0) {
    query.whereIn('symbol', symbols.trim().split(','));
  }
  query.orderBy('cmc_rank', 'asc').limit(Math.min(limit, 200))
  .then(function (result) {
    return transformers[format].format(result);
  }).then(function (result) {
    res.setHeader('Content-Type', transformers[format].contentType);
    res.send(result);
    res.end();
  })
  .catch(function (err) {
    console.dir(err);
    res.send(err);
    res.end();
  });
});

module.exports = router;
