import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, computed} from '@ioc:Adonis/Lucid/Orm'
import Post from "App/Models/Post/Post";

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public from_name: string

  @column()
  public from_email: string

  @column()
  public direction: string

  @column({serializeAs: null})
  public postId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

// Accessors ===================================================
  @computed()
  public get creation_date(){
    return this.createdAt ? this.createdAt
            .toFormat("dd/LL/yyyy 'à' HH:mm", {locale: 'fr'})
        : null
  }
  // Relationships -------------------------------------

  @belongsTo(() => Post)
  public via_post: BelongsTo<typeof Post>

  // @hasManyThrough([
  //   () => User,
  //   () => Post,
  // ])
  // public message_sent_to: HasManyThrough<typeof User>

}
