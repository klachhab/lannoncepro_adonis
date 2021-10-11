import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Post from "App/Models/Post/Post";
import UserValidator from "App/Validators/UserValidator";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import {Exception} from "@poppinss/utils";
import Application from "@ioc:Adonis/Core/Application";
import Department from "App/Models/Department";

export default class UsersController {

    public async index({}: HttpContextContract) {

        return await User.withTrashed()
            .withCount('posts')
            .withCount('reports')
            .withCount('reviews')

    }


    public async create({view}: HttpContextContract) {
        const departments = await Department.query().select('code', 'name')
        // return departments
        return view.render('auth/register', {
            departments
        })
    }

    public async edit({view}: HttpContextContract) {
        return view.render('auth/register')
     }


    public async store({request}: HttpContextContract) {

        return await request.validate(UserValidator).then(async (resp: Object) => {

            return await User.create(resp)
                .then(async (user: User) => {
                    const avatar = request.file('avatar')
                    if (avatar) {
                        const path = `uploads/profiles/${user.username}`
                        await avatar.move(Application.publicPath(path), {
                            name: `avatar.${avatar.extname}`,
                            overwrite: true
                        }).then(() => {
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
                .catch((err: Exception) => {
                    return {
                        success: false,
                        response: err.code
                    }
                })

        }).catch((err: ValidationException) => {
            return {
                success: false,
                response: err.messages
            }
        })

    }


    public async show({params}: HttpContextContract) {

        return await User.query().where('username', params.id)
            .preload('posts', posts => {
                posts.withTrashed()
            })
            .withCount('posts')
            .firstOrFail()
            .then(async user => {
                return {
                    success: true,
                    user
                }
            })
            .catch((error: Exception) => {
                return {
                    success: false,
                    error: error.code
                }
            })

    }


    public async update({params, request}: HttpContextContract) {
        return await request.validate(UserValidator)
            .then(async (resp: Object) => {
                return await User.query()
                    .where('username', params.id)
                    .firstOrFail()
                    .then(user => {
                        user.merge(resp)
                            .save()

                        return {
                            success: true,
                            response: user
                        }
                    })
                    .catch(err => {
                        return {
                            success: false,
                            response: err.messages
                        }
                    })
            })
            .catch(err => {
                return {
                    success: false,
                    response: err.messages
                }
            })
    }


    public async destroy({params}: HttpContextContract) {
        return await User.query()
            .where('username', params.id)
            .firstOrFail()
            .then(async user => {
                await user.delete()
                return {
                    success: true,
                }
            })
            .catch((err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            })
    }


    public async restore({params}: HttpContextContract) {
        return await User.onlyTrashed().where('username', params.username)
            .firstOrFail()
            .then(async user => {
                await user.restore().then(() => {
                    Post.onlyTrashed().where("user_id", user.id).restore()
                })

                return {
                    restored: true,
                    user
                }
            })
            .catch(() => {
                return {
                    restored: false,
                }
            })
    }


    public async forceDelete({params}: HttpContextContract) {
        return await User.onlyTrashed()
            .where('username', params.username)
            .firstOrFail()
            .then(async user => {
                // await user.forceDelete()
                return {
                    success: true,
                    result: await user.forceDelete()
                }
            })
            .catch((error: Exception) => {
                return {
                    success: false,
                    result: error.code
                }
            })

    }
}
