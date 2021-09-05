import { DateTime } from 'luxon'
import {
  BaseModel, column,
  BelongsTo, belongsTo,
  HasMany, hasMany
} from '@ioc:Adonis/Lucid/Orm'

import Department from "App/Models/Department";
import User from "App/Models/User";

export default class City extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column({ serializeAs: null })
  public departmentId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime


// Relationships -------------------------------------
  @belongsTo( () => Department)
  public department: BelongsTo<typeof Department>

  @hasMany( () => User)
  public users: HasMany<typeof User>
}
