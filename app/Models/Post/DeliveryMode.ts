import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class DeliveryMode extends compose(BaseModel, SoftDeletes)  {
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
