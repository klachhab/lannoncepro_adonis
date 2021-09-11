import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostReview from "App/Models/Post/PostReview";

export default class PostReviewsController {

  public async index ({}: HttpContextContract) {
    const reviews = await PostReview.query()
        .preload('post')
    return {
      reviews
    }
  }

  public async store ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
