import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {PostFactory} from "Database/factories";

export default class PostSeederSeeder extends BaseSeeder {
  public async run () {
    await PostFactory
        .with('reviews', Math.floor(Math.random() * 10))
        .with('images', Math.floor(Math.random() * 5))
        .createMany(500)
  }
}
