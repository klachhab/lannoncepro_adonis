import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";

export default class PostGallery extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public path: number

  @column()
  public postId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Relationships -------------------------------------
  @belongsTo( () => Post)
  public post: BelongsTo<typeof Post>
}
