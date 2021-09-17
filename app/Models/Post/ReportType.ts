import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import PostReport from "App/Models/Post/PostReport";

export default class ReportType extends BaseModel {
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
