import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DeliveryMode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: number

  @column()
  public mode: number

  @column.dateTime()
  public deletedAt: DateTime

}
