import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany, ManyToMany, manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Category from "App/Models/Category";
import User from "App/Models/User";
import City from "App/Models/City";
import DeliveryMode from "App/Models/Post/DeliveryMode";
import PostGallery from "App/Models/Post/PostGallery";
import PostReport from "App/Models/Post/PostReport";
import {slugify} from "@ioc:Adonis/Addons/LucidSlugify";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter';
import PostFilter from "App/Models/Filters/PostFilter";

export default class Post extends compose(BaseModel, SoftDeletes, Filterable) {

  public static $filter = () => PostFilter

  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  @slugify({
    strategy: 'simple',
    fields: ['title'],
    allowUpdates: true,
    completeWords: true,
  })
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

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null

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

  @hasMany( () => PostReport)
  public reports: HasMany<typeof PostReport>

  @manyToMany( () => User,{
    pivotTable: "favourites",
  })
  public favourites: ManyToMany<typeof User>

  @manyToMany( () => User,{
    pivotColumns: ['comment', 'rating'],
    pivotTable: "reviews",
    pivotTimestamps: {
      createdAt: true,
      updatedAt: false
    },
  })
  public reviews: ManyToMany<typeof User>

//  Hooks -------------------------------------

  // @afterDelete()
  // public static async deleteRelated(post: Post){
  //   const reviews = await post.related('reviews').query()
  //   const reports = await post.related('reports').query()
  //   const images = await post.related('images').query()
  //
  //   reviews.forEach( (review: PostReview) => {
  //     review.delete()
  //   })
  //   reports.forEach( (report: PostReport) => {
  //     report.delete()
  //   })
  //   images.forEach( (image: PostGallery) => {
  //     image.delete()
  //   })
  // }

}
