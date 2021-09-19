import { DateTime } from 'luxon'
import {
  afterDelete,
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany
} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import City from "App/Models/City";
import Post from "App/Models/Post/Post";
import PostReview from "App/Models/Post/PostReview";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import PostReport from "App/Models/Post/PostReport";

export default class User extends compose(BaseModel, SoftDeletes) {

  public serializeExtras = true

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
  public avatar: string

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

  @hasMany( () => Post)
  public posts: HasMany<typeof Post>

  @hasMany( () => PostReview)
  public reviews: HasMany<typeof PostReview>

  @hasMany( () => PostReport)
  public reports: HasMany<typeof PostReport>

// Hooks -------------------------------------
  @beforeCreate()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @afterDelete()
  public static async deleteRelated(user: User) {
    const posts = await user.related('posts').query()
    const reviews = await user.related('reviews').query()
    const reports = await user.related('reports').query()

    posts.forEach( (post: Post) => {
      post.delete()
    })
    reviews.forEach( (review: PostReview) => {
      review.delete()
    })
    reports.forEach( (report: PostReport) => {
      report.delete()
    })
  }


}
