import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {PostFactory} from "Database/factories";
import {randomInt} from "crypto";

export default class PostSeederSeeder extends BaseSeeder {
  public async run () {
    await PostFactory
        // .with('reviews', Math.floor(Math.random() * 10))
        .with('pictures', randomInt(2, 5))
        .createMany(randomInt(70000, 1000000))
  }
}
