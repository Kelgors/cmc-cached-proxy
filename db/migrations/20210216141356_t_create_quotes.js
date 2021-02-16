
exports.up = function(knex) {
  return knex.schema.createTable('quotes', function (t) {
    t.integer('id').primary(); // 1
    t.string('name'); // "Bitcoin"
    t.string('symbol'); // "BTC"
    t.string('slug'); // "bitcoin"
    t.decimal('circulating_supply', null); // 17199862
    t.decimal('total_supply', null); // 17199862
    t.decimal('max_supply', null); // 21000000
    t.integer('num_market_pairs'); // 331
    t.integer('cmc_rank'); // 1
    // last quote
    t.decimal('price', null); // 6602.60701122 (in $)
    t.decimal('volume_24h', null); // 4314444687.5194
    t.decimal('percent_change_1h', null); // 0.988615
    t.decimal('percent_change_24h', null); // 4.37185
    t.decimal('percent_change_7d', null); // -12.1352
    t.decimal('percent_change_30d', null); // -12.1352
    t.decimal('market_cap', null); // 113563929433.21645 (in $)
    t.timestamp('last_updated', { useTz: true });

    t.index('symbol');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('quotes');
};
