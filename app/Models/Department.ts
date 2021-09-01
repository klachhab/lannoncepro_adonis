import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import City from "App/Models/City";

export default class Department extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  @hasMany( () => City)
  public users: HasMany<typeof City>
}
