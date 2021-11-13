import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, computed} from '@ioc:Adonis/Lucid/Orm'
import Conversation from "App/Models/Conversation";

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public direction: string

  @column({serializeAs: null})
  public conversationId: number

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

  @belongsTo(() => Conversation)
  public conversation: BelongsTo<typeof Conversation>

  // @hasManyThrough([
  //   () => User,
  //   () => Post,
  // ])
  // public message_sent_to: HasManyThrough<typeof User>

}
