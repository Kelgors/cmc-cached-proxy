module.exports = {
  contentType: 'application/json; charset=utf-8',
  format(rows) {
    const DECIMAL_NUMBERS = [ 'circulating_supply', 'total_supply', 'max_supply', 'price', 'volume_24h', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d', 'percent_change_30d', 'market_cap' ];
    rows.forEach(function (row) {
      DECIMAL_NUMBERS.forEach(function (field) {
        row[field] = Number(row[field]);
      });
      return row;
    })
    return JSON.stringify(rows, null, 2);
  }
};
