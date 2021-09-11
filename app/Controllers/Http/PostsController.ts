import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post";

export default class PostsController {
  public async index ({request}: HttpContextContract) {
    const posts = await Post.query()
        .preload('user', builder => {
          builder.select('is_pro')
        })
        .preload('city',builder => {
          builder.select('name', 'department_id')
              .preload('department', builder => {
                builder.select('name')
              })
        })
        .preload('category', builder => {
          builder.select('name', 'category_id')
              .preload('parent', builder => {
                builder.select('name')
              })
        })
        .select('user_id', 'category_id', 'city_id',
            'title', 'price', 'negotiable'
            )
        .paginate(request.qs().page, 10)

    return {
      posts,
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
