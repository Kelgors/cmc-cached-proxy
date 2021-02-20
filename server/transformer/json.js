module.exports = {
  contentType: 'application/json; charset=utf-8',
  format(rows) {
    const DECIMAL_NUMBERS = [ 'circulating_supply', 'total_supply', 'max_supply', 'price', 'volume_24h', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d', 'percent_change_30d', 'market_cap' ];
    rows.forEach(function (row) {
      DECIMAL_NUMBERS.forEach(function (field) {
        row[field] = Number(row[field]);
      });
      row.icon = `https://s2.coinmarketcap.com/static/img/coins/64x64/${row.id}.png`;
      return row;
    });
    return Promise.resolve(JSON.stringify(rows, null, 2));
  }
};
