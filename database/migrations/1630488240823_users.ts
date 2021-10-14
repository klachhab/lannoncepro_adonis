import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('title', ['miss', 'mrs', 'mr']).notNullable();
      table.string('name').notNullable();
      table.string('username').notNullable();
      table.string('email').unique().notNullable();
      table.string('avatar').defaultTo('/images/user.png').notNullable();
      table.string('password').notNullable();
      table.boolean('email_verified').defaultTo(false);
      table.string('verification_code').nullable();
      table.enum('user_type', ['admin', 'user'])
          .notNullable().defaultTo('user');

      table.integer('phone', 10).notNullable();
      table.boolean('is_pro')
          .notNullable()
          .defaultTo(false);

      table.boolean('can_receive_news')
          .notNullable()
          .defaultTo(false);

      table.boolean('blocked')
          .notNullable()
          .defaultTo(false);

      // Relations ================================================
      table
          .integer('city_id')
          .unsigned()
          .references('cities.id')
          .onDelete('CASCADE')
      // !Relations ================================================

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
