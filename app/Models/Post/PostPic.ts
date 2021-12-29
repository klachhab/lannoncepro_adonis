import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class PostPic extends compose(BaseModel, SoftDeletes) {


  @column({ isPrimary: true })
  public id: number

  @column()
  public path: string

  @column({ serializeAs: null })
  public postId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  // Relationships -------------------------------------
  @belongsTo( () => Post)
  public post: BelongsTo<typeof Post>
}
