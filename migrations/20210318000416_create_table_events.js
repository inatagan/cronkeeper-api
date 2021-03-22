
exports.up = function(knex) {
    return knex.schema.createTable('events', table => {
        table.uuid('event_uuid').primary()
        table.string('name').notNull()
        table.string('description', 1000)
        table.string('imageUrl', 1000)
        table.datetime('datetime')
        table.uuid('user_uuid').references('user_uuid').inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('events')
};
