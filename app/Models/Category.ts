import { DateTime } from 'luxon'
import {BaseModel, beforeCreate, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {string} from "@ioc:Adonis/Core/Helpers";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public icon: string

  @column()
  public parentId: number

  @column.dateTime()
  public deletedAt: DateTime

// Relationships -------------------------------------
  @belongsTo( () => Category)
  public parent: BelongsTo<typeof Category>

  @belongsTo( () => Category)
  public subs: BelongsTo<typeof Category>

// Events -------------------------------------
  @beforeCreate()
  public static setSlug(category: Category) {
    category.slug = string.dashCase(category.name)
  }

}
