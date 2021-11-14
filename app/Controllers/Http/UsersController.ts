import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Post from "App/Models/Post/Post";
import UserValidator from "App/Validators/UserValidator";
import {Exception} from "@poppinss/utils";
import Application from "@ioc:Adonis/Core/Application";
import Department from "App/Models/Department";
import VerifyEmail from "App/Mailers/VerifyEmail";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import Hash from "@ioc:Adonis/Core/Hash";
import Encryption from "@ioc:Adonis/Core/Encryption";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import auth from "Config/auth";

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

        // Sending verification E-mail
        const sendEmail = async ( user: User) => {
            return await new VerifyEmail(user)
                .send()
                .then( async () => {

                    return {
                        success: true,
                        message: "email_sent",
                    }

                })
                .catch((err) => {
                    return {
                        success: false,
                        error: err,
                        type: "email"
                    }
                })
        }

        // Store after validation
        const store = await request.validate(UserValidator)
            .then(async (resp: Object) => {

            return await User.create(resp)
                .then(async (user: User) => {

                    // Upload Avatar : Pending =======================================

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


                    // Sending verification E-mail =======================================
                    return sendEmail(user)

                    // return await new VerifyEmail(user)
                    //     .send()
                    //     .then( async () => {
                    //
                    //         return {
                    //             success: true,
                    //             message: "email_sent",
                    //         }
                    //
                    //     })
                    //     .catch((err) => {
                    //         return {
                    //             success: false,
                    //             error: err,
                    //             type: "email"
                    //         }
                    //     })

                })
                .catch((err: Exception) => {
                    return {
                        success: false,
                        error: err,
                        type: "user_creation"
                    }
                })

        })
            .catch((err: ValidationException) => {
                return {
                    success: false,
                    error: err.messages,
                    type: "Validation"
                }
            })


        return await User.onlyTrashed()
            .where('email', request.all().email)
            .firstOrFail()
            .then(async user => {
                return user.restore()
                    .then( async () => {

                        return await Hash.make(request.all().password)
                            .then( (hashed) => {
                                user.verification_code = Encryption.encrypt(user.email)
                                user.password = hashed

                                user.title = request.all().title
                                user.name = request.all().name
                                user.username = request.all().username
                                user.phone = request.all().phone
                                user.email_verified = false
                                user.cityId = request.all().city_id

                                return user.save()
                                    .then(async user => {

                                        // Sending verification E-mail =======================================
                                        return sendEmail(user)

                                    })
                                    .catch( err => {
                                        return {
                                            success: false,
                                            error: err,
                                        }
                                    })

                            })
                            .catch(err => {
                                return {
                                    success: false,
                                    error: err,
                                }
                            });

                    })
                    .catch( err => {
                        return {
                            success: false,
                            error: "Restore error : " + err.message
                        }
                    })
            })

            .catch(async () => {
                return store
            })

    }


    public async verify({request, auth, response}: HttpContextContract) {

        return await User.query()
            .where('verification_code', request.qs().key)
            .firstOrFail()
            .then(user => {
                user.verification_code = null
                user.email_verified = true

                return user.save()
                    .then( async () => {
                        return auth.use('web').login(user)
                            .then( async () => {
                                return await auth.check()
                                    .then( () => {
                                        return response.redirect('/')
                                    })
                                    .catch( async () => {
                                        return {
                                            user: auth.user,
                                            verified: true,
                                        }
                                    })

                            })
                            .catch( (err: AuthenticationException) => {
                                return {
                                    err: err.message,
                                    verified: false
                                }
                            })

                    })
                    .catch(err => {
                        return {
                            error: err.code
                        }
                    })


            })
            .catch(err => {
                return {
                    error: err.code
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
        return await User.onlyTrashed()
            .where('username', params.username)
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


    public async conversation({auth}: HttpContextContract) {
        const user = auth.user as User

        return user.related('posts')
            .query()
            .has('conversations')
            .preload('conversations', conversations => {
                conversations.preload('messages')
            })
            .preload('images', images => {
                images.select('path')
                    .firstOrFail()
                    .then( image => {
                        return image
                    })
            })
            .select('slug', 'title', 'user_id', 'id')
            .then( posts => {
                return posts
            })
    }

    // For Vue Validator==========================

    public async is_unique({request}: HttpContextContract) {
        return await User.query()
            .where('username', request.all().value)
            .orWhere("email", request.all().value)
            .firstOrFail()
            .then( () => {
                return false
            })
            .catch( () => {
                return true
            })
    }
}
