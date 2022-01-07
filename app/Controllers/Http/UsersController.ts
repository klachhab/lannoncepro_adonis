import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Post from "App/Models/Post/Post";
import UserValidator from "App/Validators/UserValidator";
import { Exception } from "@poppinss/utils";
import Department from "App/Models/Department";
import { ValidationException } from "@adonisjs/validator/build/src/ValidationException";
import Hash from "@ioc:Adonis/Core/Hash";
import { AuthenticationException } from "@adonisjs/auth/build/standalone";

export default class UsersController {

    public async index({ response }: HttpContextContract) {

        return response.status( 404 )
        // return await User.withTrashed()
        //     .withCount('posts')
        //     .withCount('reports')
        //     .withCount('reviews')

    }


    public async create({ view, auth, response }: HttpContextContract) {
        if ( await auth.check() ){

            if ( auth.defaultGuard == "api" ) {
                return {
                    success: false,
                    response: 'authenticated'
                }
            }

            return response.redirect('/mon-profil')
        }

        const departments = await Department.query().select( 'code', 'name' )
        // return departments
        return view.render( 'auth/register', {
            departments
        } )
    }


    public async store({ request, auth }: HttpContextContract) {

        await Department
            .query()
            .where( 'code', request.all().department_code )
            .firstOrFail()
            .then( async dep => {

                await dep.related( 'cities' )
                    .firstOrCreate(
                        { code: request.all().city_code },
                        {
                            code: request.all().city_code,
                            name: request.all().city_name,
                            longitude: request.all().longitude,
                            latitude: request.all().latitude
                        }
                    )
                    .then( async city => {
                        delete request.all().department_code
                        delete request.all().department_name
                        request.all().city_id = city.id
                    } )
                    .catch( error => {
                        return {
                            success: false,
                            response: error.message,
                        }
                    } )
                // .catch( () => {
                //     delete request.all().department_code
                // } )

            } )
            .catch( async () => {
                await Department.create( {
                    code: request.all().department_code,
                    name: request.all().department_name,
                } )
                    .then( () => {
                        delete request.all().department_code
                        delete request.all().department_name
                    } )
                    .catch( error => {
                        return {
                            success: false,
                            response: error.message,
                        }
                    } )

            } )

        // return get_city


        // Store after validation
        const validated = await request.validate( UserValidator )
            .then( async (response: Object) => {
                return {
                    success: true,
                    result: response
                }

            } )
            .catch( (err: ValidationException) => {
                const validation_errors = err.messages.errors
                const errors = {}

                for ( const messageKey in validation_errors ) {
                    var message = validation_errors[messageKey]
                    errors[message.field] = message.message
                }

                return {
                    success: false,
                    result: errors,
                    error: "validation"
                }
            } )

        if ( !validated.success ) {
            return validated
        }

        return await User.onlyTrashed()
            .where( 'email', request.all().email )
            .firstOrFail()
            .then( async user => {
                return await user.restore()
                    .then( async (usr: User) => {

                        user.title = request.all().title
                        user.name = request.all().name
                        user.username = request.all().username
                        user.phone = request.all().phone
                        user.email_verified = false
                        user.cityId = request.all().city_id

                        return await usr.save()
                            .then( async u => {

                                return await auth.login(u)
                                    .then( response => {
                                        return {
                                            success: true,
                                            response,
                                        }
                                    })
                                    .catch( error => {
                                        return {
                                            success: false,
                                            response: error.message,
                                        }
                                    } )

                            } )
                            .catch( err => {
                                return err.message
                            } )

                    } )
                    .catch( err => {
                        return err.message
                    } )
            } )
            .catch( async () => {
                const data = validated.result as Object

                return await User.create( data )
                    .then( async user => {

                        return await auth.login(user)
                            .then( response => {
                                return {
                                    success: true,
                                    response,
                                }
                            })
                            .catch( error => {
                                return {
                                    success: false,
                                    response: error.message,
                                }
                            } )

                    } )
                    .catch( error => {
                        return {
                            success: false,
                            response: error.message,
                        }
                    } )
            } )

    }



    public async show({ params, auth, view, response }: HttpContextContract) {
        if ( await auth.check().then( logged => {
            return logged
        } ) ) {
            const user = auth.user as User

            if ( params.id == user.username ) {
                return response.redirect().toRoute( "web.my_profile" )
            }
        }

        const username = await auth.check()
            .then( () => {
                const user = auth.user as User

                if ( params.id ) {
                    return params.id
                } else return user.username
            } )
            .catch( (err: AuthenticationException) => {
                return {
                    error: err.message
                }
            } )

        return await User.query().where( 'username', username )
            .withCount( 'posts', posts => {
                posts.where( 'is_valid', 1 )
            } )
            .withCount( 'favourites', favourites => {
                favourites
                    .where( 'is_valid', 1 )
                    .andWhereNull( 'deleted_at' )
            } )
            .preload( 'city', city => {
                city
                    .preload( 'department' )
            } )
            .select( 'id', 'name' )
            .firstOrFail()
            .then( async user => {

                const conversations = await user
                    .related( 'conversations' )
                    .query()
                    .where( 'read', false )
                    .select( 'read' )

                if ( params.username ) {
                    return {
                        success: true,
                        user,
                    }
                } else {
                    const my_username = await auth.check()
                        .then( logged => {
                            if ( logged ) {
                                const user = auth.user as User
                                return user.username
                            } else {
                                return null
                            }
                        } )

                    return view.render( 'user/profile', {
                        user: user.serialize( {
                            fields: [ 'id', 'name', 'avatar', 'email', 'is_pro', 'email_verified',
                                'blocked', 'membre_depuis', 'username', 'is_online'
                            ],
                        } ),
                        unread_messages_count: conversations.length,

                        my_username
                    } )
                }

            } )
            .catch( (error: Exception) => {
                return {
                    success: false,
                    error: error.message
                }
            } )


    }


    public async update({ params, request }: HttpContextContract) {

        console.log( request.all() )

        return await User.query()
            .where( 'username', params.id )
            .firstOrFail()
            .then( async user => {

                request.all().can_receive_news = JSON.parse( request.all().can_receive_news )
                request.all().allow_reviews = JSON.parse( request.all().allow_reviews )


                if ( request.all().password ) {
                    user.password = await Hash.make( request.all().password );
                }

                user.merge( request.all() ).save()

                await user.load( 'city' )

                return {
                    success: true,
                    response: user
                }
            } )
            .catch( err => {
                return {
                    success: false,
                    response: err.messages
                }
            } )
    }


    public async destroy({ params, auth }: HttpContextContract) {
        return await User.query()
            .where( 'username', params.id )
            .firstOrFail()
            .then( async user => {
                if ( await auth.check() ) {
                    await auth
                        .logout()
                        .catch( (err: AuthenticationException) => {
                            return {
                                success: false,
                                result: err.message
                            }
                        } )
                }

                await user.delete()
                    .then( () => {
                        return {
                            user,
                            success: true,
                        }
                    } )
                    .catch( err => {
                        return {
                            success: false,
                            result: err.message
                        }
                    } )

            } )
            .catch( err => {
                return {
                    success: false,
                    result: err.message
                }
            } )
    }


    public async restore({ params }: HttpContextContract) {
        return await User.onlyTrashed()
            .where( 'username', params.username )
            .firstOrFail()
            .then( async user => {
                await user.restore().then( () => {
                    Post.onlyTrashed().where( "user_id", user.id ).restore()
                } )

                return {
                    restored: true,
                    user
                }
            } )
            .catch( () => {
                return {
                    restored: false,
                }
            } )
    }


    public async forceDelete({ params }: HttpContextContract) {
        return await User.onlyTrashed()
            .where( 'username', params.username )
            .firstOrFail()
            .then( async user => {
                // await user.forceDelete()
                return {
                    success: true,
                    result: await user.forceDelete()
                }
            } )
            .catch( (error: Exception) => {
                return {
                    success: false,
                    result: error.code
                }
            } )

    }


    // For API ==========================
    public async user_posts({ params, request }: HttpContextContract) {

        return await User.query().where( 'username', params.username )
            .withCount( 'posts', posts => {
                posts.where( 'is_valid', 1 )
            } )
            .withCount( 'favourites' )
            .select( 'id', 'name' )
            .firstOrFail()
            .then( async user => {

                return await user.related( 'posts' )
                    .query()
                    .where( 'is_valid', request.all().valid )
                    .preload( 'city' )
                    .preload( 'user', user => {
                        user.select( 'username' )
                    } )
                    .preload( 'pictures', images => {
                        images
                            .select( 'path' )
                            .firstOrFail()
                            .catch( (error: Exception) => {
                                return {
                                    success: false,
                                    error: error.message
                                }
                            } )
                    } )
                    .select( 'id', 'title', 'slug', 'price', 'negotiable', 'createdAt', 'cityId', 'userId' )
                    .paginate( request.all().page, 5 )

                    .catch( (error: Exception) => {
                        return {
                            success: false,
                            error: error.message
                        }
                    } )


            } )
            .catch( (error: Exception) => {
                return {
                    success: false,
                    error: error.message
                }
            } )

    }


    public async user_conversations({ auth }: HttpContextContract) {

        return auth.check()
            .then( async checked => {
                if ( !checked ) {
                    return {
                        success: false,
                        error: 'not_auth'
                    }
                }

                const user = auth.user as User


                return user

            } )

            .catch( (err: AuthenticationException) => {
                return {
                    success: false,
                    error: err.message
                }
            } )



    }


    public async user_favourites({ auth, request }: HttpContextContract) {

        const authenticated = auth.check()
            .then( checked => {
                return checked
            } )

        if ( authenticated ) {
            const user = auth.user as User

            return User.query()
                .where( 'id', user.id )
                .firstOrFail()
                .then( user => {

                    return user.related( 'favourites' )
                        .query()
                        .where( 'is_valid', 1 )
                        .andWhereNull( 'deleted_at' )
                        .preload( 'city', city => {
                            city.preload( 'department', department => {
                                department.select( 'id', 'code', 'name' )
                            } )
                                .select( 'id', 'code', 'name', 'departmentId' )
                        } )
                        .select( 'id', 'title', 'slug', 'price', 'negotiable', 'createdAt', 'cityId' )
                        .paginate( request.all().page, 5 )

                } )
                .catch( (error: Exception) => {
                    return {
                        success: false,
                        error: error.message
                    }
                } )

        } else {
            return {
                success: false,
                error: 'not_auth'
            }
        }

    }

    // Validator
    public async is_unique({ request }: HttpContextContract) {
        return await User.query()
            .where( 'username', request.all().value )
            .orWhere( "email", request.all().value )
            .firstOrFail()
            .then( () => {
                return false
            } )
            .catch( () => {
                return true
            } )
    }
}
