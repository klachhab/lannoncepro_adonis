import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import {UserFactory} from "Database/factories";

export default class UserSeederSeeder extends BaseSeeder {
  public async run () {
    await UserFactory
        .createMany(1000)
  }
}
