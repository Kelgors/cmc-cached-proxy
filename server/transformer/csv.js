module.exports = {
  contentType: 'text/csv; charset=utf-8',
  format(rows) {
    return [
      'symbol,name,circulating_supply,total_supply,max_supply,num_market_pairs,cmc_rank,price,volume_24h,percent_change_1h,percent_change_24h,percent_change_7d,percent_change_30d,market_cap,last_updated',
      ...rows.map(function (row) {
        return [ row.symbol, row.name, row.circulating_supply, row.total_supply, row.max_supply, row.num_market_pairs, row.cmc_rank, row.price, row.volume_24h, row.percent_change_1h, row.percent_change_24h, row.percent_change_7d, row.percent_change_30d, row.market_cap, row.last_updated ].join(',');
      })
    ].join('\r\n');
  }
};
