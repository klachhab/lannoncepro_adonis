import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import {string} from "@ioc:Adonis/Core/Helpers";
import Post from "App/Models/Post";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public icon: string

  @column({ serializeAs: null })
  public parentId: number

  @column.dateTime()
  public deletedAt: DateTime

// Relationships -------------------------------------
  @belongsTo( () => Category, {
    foreignKey: "parentId"
  })
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
