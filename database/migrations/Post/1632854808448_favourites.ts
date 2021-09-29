import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Favourites extends BaseSchema {
  protected tableName = 'favourites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id')
          .unsigned()
          .references('users.id')
          .notNullable()

      table.integer('post_id')
          .unsigned()
          .references('posts.id')
          .notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
