import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";
import User from "App/Models/User";
import ReportType from "App/Models/Post/ReportType";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class PostReport extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public comment: string

  @column({ serializeAs: null })
  public userId: number | null

  @column({ serializeAs: null })
  public postId: number

  @column({ serializeAs: null })
  public reportTypeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  // Relationships -------------------------------------
  @belongsTo( () => Post)
  public post: BelongsTo<typeof Post>

  @belongsTo( () => User)
  public user: BelongsTo<typeof User>

  @belongsTo( () => ReportType)
  public report_type: BelongsTo<typeof ReportType>
}
