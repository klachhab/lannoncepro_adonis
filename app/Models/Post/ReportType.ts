import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import PostReport from "App/Models/Post/PostReport";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class ReportType extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ref: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  // Relationships -------------------------------------

  @hasMany( () => PostReport)
  public post_reports: HasMany<typeof PostReport>
}
