const express = require('express');
const rateLimit = require('express-rate-limit');
const transformers = require('../transformer');
const cors = require('cors');
const router = express.Router();

const ADMIN_API_KEYS = process.env.ADMIN_API_KEYS.split(',');
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10 // limit each IP to 5 requests per windowMs
});

router.use(cors());
router.use(function (req, res, next) {
  const apikey = req.headers['x-api-key'] || req.query['apikey'];
  if (ADMIN_API_KEYS.includes(apikey)) {
    next();
  } else {
    return limiter(req, res, next);
  }
});

router.get('/quotes/latest.:format', function (req, res) {
  const { symbols = '', limit = '200', fields, pretty, separator } = req.query;
  console.log(fields);
  const { format = 'json' } = req.params;
  let query = knex('quotes').select()
  if (symbols.trim().length > 0) {
    query.whereIn('symbol', symbols.trim().split(','));
  }
  query.orderBy('cmc_rank', 'asc').limit(Math.min(limit, 200))
  .then(function (result) {
    return transformers[format].format(result, {
      fields: typeof fields === 'string' && fields.length > 0 ? fields.split(',') : [],
      pretty: pretty === '1',
      separator,
    });
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
