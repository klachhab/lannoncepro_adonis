import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostPics extends BaseSchema {
    protected tableName = 'post_pics'

    public async up() {
        this.schema.createTable( this.tableName, (table) => {
            table.increments( 'id' )

            table.integer( 'post_id' ).unsigned()
                .references( 'posts.id' )
                .notNullable()

            table.string( 'path' ).notNullable()
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp( 'created_at', { useTz: true } )
            table.timestamp( 'deleted_at', { useTz: true } )
        } )
    }

    public async down() {
        this.schema.dropTable( this.tableName )
    }
}
