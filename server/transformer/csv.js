const stringify = require('csv-stringify');
const COLUMNS = [
  'id',
  'symbol',
  'name',
  'circulating_supply',
  'total_supply',
  'max_supply',
  'num_market_pairs',
  'cmc_rank',
  'price',
  'volume_24h',
  'percent_change_1h',
  'percent_change_24h',
  'percent_change_7d',
  'percent_change_30d',
  'market_cap',
  'icon',
  'last_updated',
  'category',
  'platform',
  'description',
  'tags',
  'website',
  'technical_doc',
];

const DECIMAL_NUMBERS = [ 'circulating_supply', 'total_supply', 'max_supply', 'price', 'volume_24h', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d', 'percent_change_30d', 'market_cap' ];

function formatNumber(number) {
  return `${(number || 0).toString().split('.').join(',')}`;
}

module.exports = {
  contentType: 'text/csv; charset=utf-8',
  format(rows, { fields, separator }) {
    const CSV_FIELDS = Array.isArray(fields) && fields.length > 0
      ? fields
      : COLUMNS;
    return new Promise(function (resolve, reject) {
      const stringifier = stringify({ delimiter: separator || ',' });
      const data = [];
      stringifier.write(CSV_FIELDS);
      rows.forEach(function (row) {
        stringifier.write(CSV_FIELDS.map(function (column) {
          if (DECIMAL_NUMBERS.includes(column)) {
            return formatNumber(row[column]);
          }
          return row[column];
        }))
      });
      stringifier.on('readable', function () {
        let row;
        while (row = stringifier.read()){
          data.push(row)
        }
      });
      stringifier.on('error', function (err) {
        reject(err);
      });
      stringifier.on('finish', function (err) {
        resolve(data.join(''));
      });
      stringifier.end();
    });
  }
};
