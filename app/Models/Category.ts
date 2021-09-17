import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import {string} from "@ioc:Adonis/Core/Helpers";
import Post from "App/Models/Post/Post";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class Category extends compose(BaseModel, SoftDeletes)  {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public icon: string

  @column({ serializeAs: null })
  public categoryId: number

  @column.dateTime()
  public deletedAt: DateTime

// Relationships -------------------------------------
  @belongsTo( () => Category)
  public parent: BelongsTo<typeof Category>

  @hasMany( () => Category)
  public subs: HasMany<typeof Category>

  @hasMany( () => Post)
  public posts: HasMany<typeof Post>

// Events -------------------------------------
  @beforeCreate()
  public static setSlug(category: Category) {
    category.slug = string.dashCase(category.name)
  }

}
