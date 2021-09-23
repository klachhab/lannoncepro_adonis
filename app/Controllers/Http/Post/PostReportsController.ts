import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostReport from "App/Models/Post/PostReport";
import Post from "App/Models/Post/Post";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";
import ReportType from "App/Models/Post/ReportType";
import ReportValidator from 'App/Validators/Post/ReportValidator';
import { ValidationException } from '@adonisjs/validator/build/src/ValidationException';
import { Exception } from '@poppinss/utils';

export default class PostReportsController {
  public async index ({}: HttpContextContract) {
    return {
      reports : await PostReport.query()
          .preload('post', post => {
            post.select('title', 'slug')
          })
    }
  }


  public async store ({request}: HttpContextContract) {

    return await request.validate(ReportValidator)
    .then(async (result: Object) => {

      await Post.findOrFail(request.qs().post)
      
      .then(async (post: Post) => {

        return await post.related('reports')
        .create(result)
        .then(async () => {
          
          const post = await Post.query()
          .withCount('reports')
          .select('id', 'title', 'slug')
          
          return {
            success: true,
            post_reports: post
          }

        })
        .catch((err: Exception) => {
          return {
            success: false,
            error: err.code
          }
        });

        
      }).catch((err) => {
        return {
          success: false,
          error: err.code
        }
      });
      
    }).catch((err: ValidationException) => {
      return {
        success: false,
        messages: err.messages
      }
    });

    try {
      await Post.findOrFail(request.qs().post)
      await ReportType.findOrFail(request.qs().report_type_id)

      const report = await PostReport.create(request.all())

      return { report }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.code }
    }
  }

  public async update ({request, params}: HttpContextContract) {
    try {
      const report = await PostReport.query().where('id', params.id).update(request.all())
      return { report }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.message }
    }
  }

  public async destroy ({params}: HttpContextContract) {
    try {
      const report = await PostReport.query().where('id', params.id).delete()
      return { report }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.message }
    }
  }
}
