import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').nullable()

      // Relations ================================================
      table
          .integer('user_id').unsigned()
          .references('users.id')
          .onDelete('CASCADE').notNullable()

      table.integer('category_id').unsigned()
          .references('categories.id')
          .onDelete('CASCADE').notNullable()

      table.integer('city_id').unsigned()
          .references('cities.id')
          .onDelete('CASCADE').notNullable()

      table.integer('delivery_mode_id').unsigned()
          .references('delivery_modes.id')
          .onDelete('CASCADE').notNullable()

      // ! Relations ================================================

      table.string('title').notNullable()
      table.text('description').notNullable()
      table.enum('condition', ['new', 'used']).notNullable()
      table.float('price',11, 2).nullable()
      table.boolean('negotiable').defaultTo(false)
      table.float('lat', 11, 2).nullable()
      table.float('lon', 11, 2).nullable()
      table.enum('video_type', ['iframe', 'video']).nullable()
      table.string('video_link').nullable()

      table.boolean('is_valid').defaultTo(false)
      table.boolean('featured').defaultTo(false)

      /**
       * Uses timestampTz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
