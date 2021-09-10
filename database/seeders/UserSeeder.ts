import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {UserFactory} from "Database/factories";

export default class UserSeederSeeder extends BaseSeeder {
  public async run () {
    await UserFactory
        .with("posts", Math.floor(Math.random() * 4))
        .createMany(50)
  }
}
