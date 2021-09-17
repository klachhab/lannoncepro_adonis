import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostReports extends BaseSchema {
  protected tableName = 'post_reports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
          .integer('user_id').unsigned()
          .references('users.id')
          .onDelete('CASCADE').notNullable()

      table.integer('post_id').unsigned()
          .references('posts.id')
          .onDelete('CASCADE').notNullable()

      table.text('comment').notNullable()
      /**
       * Uses timestampTz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
