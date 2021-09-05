import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import City from "App/Models/City";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public picture: string

  @column()
  public email_verified: boolean

  @column()
  public user_type: string

  @column()
  public phone: number

  @column()
  public is_pro: boolean

  @column()
  public can_receive_news: boolean

  @column()
  public blocked: boolean

  @column({ serializeAs: null })
  public cityId: number


  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime


// Relationships -------------------------------------
  @belongsTo( () => City)
  public city: BelongsTo<typeof City>

// Events -------------------------------------
  @beforeCreate()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }


}
