function formatNumber(number) {
  return `"${(number || 0).toString().split('.').join(',')}"`;
}

module.exports = {
  contentType: 'text/csv; charset=utf-8',
  format(rows) {
    return [
      'id,symbol,name,circulating_supply,total_supply,max_supply,num_market_pairs,cmc_rank,price,volume_24h,percent_change_1h,percent_change_24h,percent_change_7d,percent_change_30d,market_cap,icon,last_updated',
      ...rows.map(function (row) {
        return [ row.id, row.symbol, row.name, formatNumber(row.circulating_supply), formatNumber(row.total_supply), formatNumber(row.max_supply), row.num_market_pairs, row.cmc_rank, formatNumber(row.price), formatNumber(row.volume_24h), formatNumber(row.percent_change_1h), formatNumber(row.percent_change_24h), formatNumber(row.percent_change_7d), formatNumber(row.percent_change_30d), formatNumber(row.market_cap), `https://s2.coinmarketcap.com/static/img/coins/64x64/${row.id}.png`, row.last_updated ].join(',');
      })
    ].join('\r\n');
  }
};
