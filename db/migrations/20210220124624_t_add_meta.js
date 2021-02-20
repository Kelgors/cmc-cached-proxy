
exports.up = function(knex) {
  return knex.schema.alterTable('quotes', function (t) {
    t.string('category');
    t.string('platform');
    t.text('description');
    t.string('tags');
    t.string('website', 1024);
    t.string('technical_doc', 1024);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('quotes', function (t) {
    t.dropColumn('category');
    t.dropColumn('platform');
    t.dropColumn('description');
    t.dropColumn('tags');
    t.dropColumn('website', 1024);
    t.dropColumn('technical_doc', 1024);
  });
};
