import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Conversations extends BaseSchema {
    protected tableName = 'conversations'

    public async up() {
        this.schema.createTable( this.tableName, (table) => {
            table.increments( 'id' )
            table.string( 'from_name' ).notNullable()
            table.string( 'from_email' ).notNullable()
            table.string( 'conversation_key' ).notNullable()
            table.boolean( 'read' ).defaultTo( false )

            table.integer( 'post_id' )
                .unsigned()
                .references( 'posts.id' )
                .notNullable()

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp( 'created_at', { useTz: true } )
            table.timestamp( 'updated_at', { useTz: true } )
            table.timestamp( 'deleted_at', { useTz: true } )
        } )
    }

    public async down() {
        this.schema.dropTable( this.tableName )
    }
}
