
exports.up = function(knex) {
    return knex.schema.createTable('contacts', table => {
        table.uuid('contacts_uuid').primary()
        table.string('contact').notNull()
        table.uuid('user_uuid').references('user_uuid')
            .inTable('users').notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('contacts')
};
