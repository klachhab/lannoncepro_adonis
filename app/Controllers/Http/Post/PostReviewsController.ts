import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostReview from "App/Models/Post/PostReview";
import Post from "App/Models/Post/Post";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";
import PostReviewValidator from 'App/Validators/Post/PostReviewValidator';
import { ValidationException } from '@adonisjs/validator/build/src/ValidationException';
import { Exception } from '@poppinss/utils';

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

    return await request.validate(PostReviewValidator)
    .then(async (result: Object) => {
      return await Post.query()
        .where('slug',request.qs().post)
        .firstOrFail()
      
        .then( async (pst) => {
          return {
            success: true,
            review: await pst.related('reviews').create(result)
          }
        })
        .catch((err: Exception) => {
          return {
            success: false,
            message: err.message,
          }
        });

      
    })
    .catch((err: ValidationException) => {
      return {
        success: false,
        message: err.messages,
      }
    });

  }

  public async update ({request, params}: HttpContextContract) {
    
    return await request.validate(PostReviewValidator)
    .then(async (result: Object) => {

      await PostReview.query()
      .where('id', params.id)
      .update(result)
      .then(async (result) => {
        return await {
          success: true,
          result,
        }
      }).catch(async (err: Exception) => {
        return await {
          success: false,
          message: err.message,
        }
      });

    })
    
    .catch((err: ValidationException) => {
      return {
        success: false,
        message: err.messages,
      }
    });
    
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
