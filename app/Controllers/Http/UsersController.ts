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


    public async show({params, auth, view}: HttpContextContract) {

        const username = await auth.check()
            .then( logged => {
                const user = auth.user as User
                if (!logged && (params.id || params.username)) {
                    return params.id || params.username
                }
                else return user.username
            })
            .catch( (err: AuthenticationException) => {
                return {
                    error: err.message
                }
            })

        return await User.query().where('username', username)
            .withCount('posts', posts => {
                posts.where('is_valid', 1)
            })
            .withCount('favourites', favourites => {
                favourites
                    .where('is_valid', 1)
                    .andWhereNull('deleted_at')
            })
            .preload('city', city => {
                city
                    .preload('department')
            })
            .select('id', 'name')
            .firstOrFail()
            .then(async user => {

                const conversations = await user
                    .related('conversations')
                    .query()
                    .select('read')

                if (params.username) {
                    return {
                        success: true,
                        user,
                        // user: user
                        //     .serialize({
                        //         fields: [
                        //             'id', 'title', 'name', 'phone', 'is_pro',
                        //             'blocked', 'membre_depuis'
                        //         ],
                        //     }),

                    }
                }

                else {
                    return view.render('user/profile', {
                        user: user.serialize({
                            fields: ['id', 'name', 'avatar', 'email', 'is_pro',
                                'blocked', 'membre_depuis', 'username'
                            ],
                        }),
                        unread_messages_count: conversations
                            .filter(conversation => conversation.read)
                            .length,
                    })
                }

            })
            .catch((error: Exception) => {
                return {
                    success: false,
                    error: error.message
                }
            })


    }


    public async update({params, request}: HttpContextContract) {

        console.log(request.all())

        return await User.query()
            .where('username', params.id)
            .firstOrFail()
            .then(async user => {

                request.all().can_receive_news = JSON.parse(request.all().can_receive_news)
                request.all().allow_reviews = JSON.parse(request.all().allow_reviews)


                if (request.all().password){
                    user.password = await Hash.make(request.all().password);
                }

                user.merge(request.all()).save()

                await user.load('city')

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


    // For API ==========================
    public async user_posts({auth, params, request}: HttpContextContract){

        const username = await auth.check()
            .then( logged => {
                const user = auth.user as User
                if (!logged && (params.id || params.username)) {
                    return params.id || params.username
                }
                else return user.username
            })
            .catch( (err: AuthenticationException) => {
                return {
                    error: err.message
                }
            })

        return await User.query().where('username', username)
            .withCount('posts', posts => {
                posts.where('is_valid', 1)
            })
            .withCount('favourites')
            .select('id', 'name')
            .firstOrFail()
            .then(async user => {

                const posts = await user.related('posts')
                    .query()
                    .where('is_valid', request.all().valid)
                    .preload('city')
                    .preload('images', images => {
                        images
                            .select('path')
                            .firstOrFail()
                    })
                    .select('id', 'title', 'slug', 'price', 'negotiable', 'createdAt', 'cityId')
                    .paginate(request.all().page, 5)


                return posts

            })
            .catch((error: Exception) => {
                return {
                    success: false,
                    error: error.message
                }
            })

    }


    public async user_conversations({auth, request}: HttpContextContract){

        return auth.check()
            .then( async checked => {
                if (!checked) {
                    return {
                        success: false,
                        error: 'not_auth'
                    }
                }

                const user = auth.user as User


                return user

            })

            .catch( (err: AuthenticationException) => {
                return {
                    success: false,
                    error: err.message
                }
            })



    }

    public async user_favourites({auth, request}: HttpContextContract){

        const authenticated = auth.check()
            .then( checked => {
                return checked
            })

        if (authenticated) {
            const user = auth.user as User

            return User.query()
                .where('id', user.id)
                .firstOrFail()
                .then(user => {

                    return user.related('favourites')
                        .query()
                        .where('is_valid', 1)
                        .andWhereNull('deleted_at')
                        .preload('city', city => {
                            city.preload('department', department => {
                                department.select('id', 'code', 'name')
                            })
                                .select('id', 'code', 'name', 'departmentId')
                        })
                        .select('id', 'title', 'slug', 'price', 'negotiable', 'createdAt', 'cityId')
                        .paginate(request.all().page, 5)

                })
                .catch((error: Exception) => {
                    return {
                        success: false,
                        error: error.message
                    }
                })

        }
        else {
            return {
                success: false,
                error: 'not_auth'
            }
        }

    }

    // Validator
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
