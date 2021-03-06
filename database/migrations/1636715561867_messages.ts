import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
    protected tableName = 'messages'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.text('message').notNullable()
            table.enu('direction', ['from_seller', 'from_user'])
                .defaultTo('from_user')

            table.integer('conversation_id')
                .unsigned()
                .references('conversations.id')
                .notNullable()

            /**
             * Uses timestampTz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', {useTz: true})
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
