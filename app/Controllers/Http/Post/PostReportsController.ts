import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostReport from "App/Models/Post/PostReport";
import Post from "App/Models/Post/Post";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";

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
    try {
      const post = await Post.findOrFail(request.qs().post)
      const report = await post.related('reports').create(request.all())

      return { report }

    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.message }
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
