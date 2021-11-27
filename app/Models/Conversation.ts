import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column, computed, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import randomstring from "randomstring"
import Message from "App/Models/Message";
import Post from "App/Models/Post/Post";


export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public from_name: string

  @column()
  public from_email: string

  @column()
  public conversationKey: string

  @column()
  public read: boolean

  @column({serializeAs: null})
  public postId: number

  @column.dateTime({autoCreate: true, serializeAs: null})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null})
  public updatedAt: DateTime

  @column.dateTime({serializeAs: null})
  public deletedAt: DateTime | null

// Relationships ===============================================

  @hasMany(() => Message, )
  public messages: HasMany<typeof Message>

  @belongsTo(() => Post, )
  public post: BelongsTo<typeof Post>

// Accessors ===================================================
  @computed()
  public get creation_date(){
    return this.createdAt ? this.createdAt
            .toFormat("dd/LL/yyyy 'à' HH:mm", {locale: 'fr'})
        : null
  }

  // Hooks -------------------------------------

  @beforeCreate()
  public static async addConversationKey(conversation: Conversation) {
    conversation.conversationKey = randomstring.generate(128);
  }
}
