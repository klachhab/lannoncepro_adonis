import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {PostFactory} from "Database/factories";

export default class PostSeederSeeder extends BaseSeeder {
  public async run () {
    await PostFactory.createMany(Math.floor(Math.random() * 10) + 2)

  }
}