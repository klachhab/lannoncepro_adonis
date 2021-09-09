import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post";

export default class DeliveryMode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: number

  @column()
  public mode: number

  @column.dateTime()
  public deletedAt: DateTime

  // Relationships -------------------------------------

  @hasMany( () => Post)
  public posts: HasMany<typeof Post>

}
