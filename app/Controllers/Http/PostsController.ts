import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Post from "App/Models/Post";
// import Category from "App/Models/Category";
import {UserFactory} from "Database/factories";

export default class PostsController {
  public async index ({}: HttpContextContract) {
    const users = await UserFactory.createMany(100)

    return {
      users
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
