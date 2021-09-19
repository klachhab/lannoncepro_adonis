import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";
import Post from "App/Models/Post/Post";
import PostReview from "App/Models/Post/PostReview";
import PostReport from "App/Models/Post/PostReport";
import UserValidator from "App/Validators/UserValidator";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import {Exception} from "@poppinss/utils";
import Application from "@ioc:Adonis/Core/Application";

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

    return await request.validate(UserValidator)
        .then( async (resp: Object) => {
          return await User.create(resp)
              .then( async (user: User) => {
                const avatar = request.file('avatar')

                if (avatar) {
                  const path = `uploads/profiles/${user.username}`
                  await avatar.move(Application.publicPath(path), {
                    name: `avatar.${avatar.extname}`,
                    overwrite: true
                  }).then( () => {
                    user.merge({
                      avatar: `/uploads/profiles/${user.username}/avatar.${avatar.extname}`
                    }).save()
                  })
                }

                return {
                  success: true,
                  response: user
                }
              })
              .catch( (err: Exception) => {
                return {
                  success: false,
                  response: err.code
                }
              })

        })

        .catch( (err: ValidationException) => {
          return {
            success: false,
            response: err.messages
          }
        })

    // const user = await User.create(data)
    //     .then( (user: User) => {
    //       const avatar = request.file('avatar')
    //       const path = `uploads/users/${user.username}`
    //
    //       if (avatar){
    //         avatar.move(Application.publicPath(path), {
    //           name: `avatar.${avatar.extname}`,
    //           overwrite: true
    //         }).then( () => {
    //           user.merge({
    //             avatar: `/uploads/users/${user.username}`
    //           }).save()
    //         })
    //       }
    //     })
    //
    //     .catch((error: Exception) => {
    //       return {
    //         success: false,
    //         response: error.message,
    //       }
    //     })
    //
    // return {
    //   success: true,
    //   response: user,
    // }

  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }


  public async update ({params, request}: HttpContextContract) {
    const user = await User.query()
        .where('id', params.id)
        .firstOrFail()

    user.merge(request.all())
        .save()
  }


  public async destroy ({params}: HttpContextContract) {
    return await User.findOrFail(params.id)
        .then( async user => {
          await user.delete()
          return {
            success: true,
            result: user
          }
        })
        .catch( (err: Exception) => {
          return {
            success: false,
            result: err.code
            // result: user
          }
        })
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

  public async forceDelete({params} : HttpContextContract) {
    return await User.onlyTrashed()
        .where('id', params.id)
        .firstOrFail()
        .then( async user => {
          // await user.forceDelete()
          return {
            success: true,
            result: await user.forceDelete()
          }
        })
        .catch( (error: Exception) => {
          return {
            success: false,
            result: error.code
          }
        })

  }
}
