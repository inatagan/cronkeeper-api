
exports.up = function(knex) {
    return knex.schema.createTable('following', table => {
        table.uuid('user_following').references('user_uuid')
            .inTable('users').notNull()
        table.uuid('user_followed').references('user_uuid')
            .inTable('users').notNull()
        table.primary(['user_following', 'user_followed'])
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('following')
};
