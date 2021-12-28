import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cities extends BaseSchema {
  protected tableName = 'cities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable();
      table.string('code').notNullable();
      // lon < lat
      table.decimal('longitude', 10, 6).notNullable()
          .defaultTo(0)
      table.decimal('latitude',10, 6).notNullable()
          .defaultTo(0)

      table
          .integer('department_id')
          .notNullable()
          .unsigned()
          .references('departments.id')
          .onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
