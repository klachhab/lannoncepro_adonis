import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostReports extends BaseSchema {
  protected tableName = 'post_reports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.text('comment').notNullable()

      table
          .integer('report_type_id')
          .unsigned()
          .references('report_types.id')

      table
          .integer('user_id')
          .unsigned()
          .references('users.id')

      table.integer('post_id')
          .unsigned()
          .references('posts.id')

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
