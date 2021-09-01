import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Department from "App/Models/Department";
import User from "App/Models/User";

export default class City extends BaseModel {
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


  @belongsTo( () => Department)
  public department: BelongsTo<typeof Department>

  @hasMany( () => User)
  public users: HasMany<typeof User>
}
