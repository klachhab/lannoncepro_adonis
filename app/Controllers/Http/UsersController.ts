import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";
import Application from "@ioc:Adonis/Core/Application";
import {Exception} from "@poppinss/utils";
import Post from "App/Models/Post/Post";
import PostReview from "App/Models/Post/PostReview";
import PostReport from "App/Models/Post/PostReport";

export default class UsersController {
  public async index ({}: HttpContextContract) {
    const users = await User.withTrashed()
        .withCount('posts')
        .withCount('reports')
        .withCount('reviews')

    users.forEach( (user: User) => {
      console.log(user.$extras)
    })

    return {
      users
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request}: HttpContextContract) {
    try {
      const user = await User.create(request.all())

      const avatar = request.file('avatar')
      if (avatar){
        const path = `uploads/users/${user.username}`
        // await avatar.move(Application.publicPath(path))
        //     .then( () => {
        //       user.merge({
        //         avatar: "/" + path
        //       }).save()
        //     })
        //     .catch( err => {
        //       return {err}
        //     })


        try {
          await avatar.move(Application.publicPath(path), {
            name: `avatar.${avatar.extname}`,
            overwrite: true
          })
        }
        // @ts-ignore
        catch (e: Exception) {
          return {error: e}
        }

      }
      else return

      return {
        user: await user.load("city")
      }
    }
    // @ts-ignore
    catch (e: HttpException) {
      return { error: e.code }
    }
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({params, request}: HttpContextContract) {
    const user = await User.query()
        .where('id', params.id)
        .firstOrFail()
    await user.merge(request.all())
  }

  public async destroy ({params}: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return {user: user.name}
    }
        // @ts-ignore
    catch (e: HttpException) {
      return { error: e.code }
    }
  }

  public async restore ({params}: HttpContextContract) {
    try {
      const user = await User.onlyTrashed().where('id', params.id).firstOrFail()
      await user.restore().then( () => {
        Post.onlyTrashed().where("user_id", user.id).restore()
        PostReview.onlyTrashed().where("user_id", user.id).restore()
        PostReport.onlyTrashed().where("user_id", user.id).restore()
      })

      return {
        restored: true,
        user
      }
    }
    // @ts-ignore
    catch (e: HttpException) {
      return {
        restored: false,
        error: e.code
      }
    }
  }
}
