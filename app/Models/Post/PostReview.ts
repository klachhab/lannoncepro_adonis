import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Post from "App/Models/Post/Post";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class PostReview extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  public id: number

  @column()
  public comment: string

  @column()
  public rating: number

  @column({ serializeAs: null })
  public postId: number

  @column({ serializeAs: null })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime


// Relationships -------------------------------------
  @belongsTo( () => User)
  public user: BelongsTo<typeof User>

  @belongsTo( () => Post)
  public post: BelongsTo<typeof Post>


}
