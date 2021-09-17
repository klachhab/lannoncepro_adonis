import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostReview from "App/Models/Post/PostReview";
import Post from "App/Models/Post/Post";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";

export default class PostReviewsController {

  public async index ({}: HttpContextContract) {
    return {
      reviews: await PostReview.query()
          .preload('post', post => {
            post.select('title', 'slug')
          }).limit(10)
    }
  }

  public async store ({request}: HttpContextContract) {

    try {
      const post = await Post.findOrFail(request.qs().post)
      const review = await post.related('reviews').create(request.all())

      return { review }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return {
        error: e.code
      }
    }

  }

  public async update ({request, params}: HttpContextContract) {
    try {
      const review = await PostReview.query()
          .where('id', params.id)
          .update(request.all())

      return { review }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.code }
    }
  }

  public async destroy ({params}: HttpContextContract) {
    try {
      const review = await PostReview.findOrFail(params.id)

      await review.delete()

      return {review}
    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.code }
    }
  }
}
