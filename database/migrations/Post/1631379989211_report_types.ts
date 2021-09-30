import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReportTypes extends BaseSchema {
  protected tableName = 'report_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('ref')
      table.string('name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
