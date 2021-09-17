import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Category from "App/Models/Category";
import User from "App/Models/User";
import City from "App/Models/City";
import DeliveryMode from "App/Models/DeliveryMode";
import PostGallery from "App/Models/Post/PostGallery";
import PostReview from "App/Models/Post/PostReview";
import {string} from "@ioc:Adonis/Core/Helpers";
import PostReport from "App/Models/Post/PostReport";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public condition: string

  @column()
  public price: number

  @column()
  public negotiable: boolean

  @column()
  public lat: number

  @column()
  public lon: number

  @column()
  public video_link: string

  @column()
  public video_type: string

  @column()
  public is_valid: boolean

  @column()
  public featured: boolean


  @column({serializeAs: null})
  public userId: number

  @column({serializeAs: null})
  public categoryId: number

  @column({serializeAs: null})
  public cityId: number

  @column({serializeAs: null})
  public deliveryModeId: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public deletedAt: DateTime

// Relationships -------------------------------------
  @belongsTo( () => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo( () => User)
  public user: BelongsTo<typeof User>

  @belongsTo( () => City)
  public city: BelongsTo<typeof City>

  @belongsTo( () => DeliveryMode)
  public deliveryMode: BelongsTo<typeof DeliveryMode>


  @hasMany( () => PostGallery)
  public images: HasMany<typeof PostGallery>

  @hasMany( () => PostReview)
  public reviews: HasMany<typeof PostReview>

  @hasMany( () => PostReport)
  public reports: HasMany<typeof PostReport>

// Events -------------------------------------
  @beforeCreate()
  public static async slugPost(post: Post) {
    post.slug = string.dashCase(post.title)
  }

}
