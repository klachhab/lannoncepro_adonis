import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostReports extends BaseSchema {
  protected tableName = 'post_reports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.text('comment').notNullable()

      // post_reports_user_id_foreign
      table.integer('user_id')
          .unsigned()
          .references('users.id')
          .onDelete('SET NULL')

      // post_reports_post_id_foreign
      table.integer('post_id')
          .unsigned()
          .references('posts.id')
          .notNullable()
          .onDelete('Cascade')

      // post_reports_report_type_id_foreign
      table.integer('report_type_id')
          .unsigned()
          .references('report_types.id')
          .onDelete('SET NULL')

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
