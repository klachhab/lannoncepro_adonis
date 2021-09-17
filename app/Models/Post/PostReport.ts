import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";
import User from "App/Models/User";

export default class PostReport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public postId: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Relationships -------------------------------------
  @belongsTo( () => Post)
  public post: BelongsTo<typeof Post>

  @belongsTo( () => User)
  public user: BelongsTo<typeof User>
}
