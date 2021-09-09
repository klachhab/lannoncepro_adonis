import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Post from "App/Models/Post";
import Category from "App/Models/Category";

export default class PostsController {
  public async index ({}: HttpContextContract) {
    const categories = await Category.query()
        .withCount('posts')
        .preload('parent')
        .preload('posts')

    return {
      categories
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
