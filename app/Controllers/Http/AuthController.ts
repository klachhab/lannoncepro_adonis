import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import Encryption from "@ioc:Adonis/Core/Encryption";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { ValidationException } from "@adonisjs/validator/build/src/ValidationException";
import RegisterVerification from "App/Mailers/RegisterVerification";
import { EmailTransportException } from "@adonisjs/mail/build/src/Exceptions/EmailTransportException";
import ResetPassword from "App/Mailers/ResetPassword";

export default class AuthController {

    public async check({auth}: HttpContextContract) {

        return auth.check()
            .then( async authenticated => {
                const resp = {
                    success: true,
                    authenticated,
                    user: null,
                    unread_messages: 0,
                } as {
                    success: boolean,
                    authenticated: boolean,
                    user: User | null,
                    unread_messages: number,
                }

                if ( authenticated ) {
                    const user = auth.user as User

                    await user.load('posts', posts => {
                        posts.select('id')
                            .withCount('conversations', conversations => {
                                conversations.where('read', 0)
                            })
                    })

                    resp.user = user.serialize({
                        fields: ['name', 'username']
                    }) as User

                    const conversations = user.posts
                        .map(post => post.$extras.conversations_count)

                    resp.unread_messages = conversations.length ? conversations.reduce((a,b) => {
                        return a + b
                    }) : 0

                }

                return resp

            } )
            .catch( (err) => {
                return {
                    success: false,
                    reason: 'auth_check',
                    response: err.message
                }
            })

    }

    public async login({auth, request, view, response}: HttpContextContract) {

        if (request.method() == "POST") {

            const auth_field = request.all().auth_field
            const password = request.all().password

            // return request.all()

            // Check user -------------
            return await User.query()
                .whereNull('deleted_at')
                .andWhere('email', auth_field)
                .orWhere('username', auth_field)
                .firstOrFail()
                .then(async user => {
                    return await Hash.verify(user.password, password)
                        .then( async verified => {

                            if ( verified ) {

                                return auth
                                    .use(request.all().api ? 'api': 'web')
                                    .login(user)
                                    .then( response => {
                                        return {
                                            success: true,
                                            response
                                        }
                                    })
                                    .catch( err => {
                                        return {
                                            success: false,
                                            reason: 'auth',
                                            response: err.message
                                        }
                                    })

                            }

                            else return {
                                success: false,
                                reason: 'auth',
                                response: 'password'
                            }

                        })

                        .catch( error => {
                            return {
                                success: false,
                                reason: 'hashing',
                                response: error.message
                            }
                        })

                })
                .catch( () => {
                    return {
                        success: false,
                        reason: 'auth',
                        response: 'user'
                    }
                })


        }

        else {
            if ( await auth.check() ){

                if ( auth.defaultGuard == "api" ) {
                    return {
                        success: false,
                        response: 'authenticated'
                    }
                }

                return response.redirect().toRoute('web.my_profile')
            }

            return view.render('auth/login')

        }
    }


    public async logout({auth}: HttpContextContract) {

        const log = auth.defaultGuard == "web" ? auth.use('web') : auth.use('api')

        if (await log.check()) {
            return await log.logout()
                .then( () => {
                    return {
                        logged_out: true
                    }
                })
                .catch(e => {
                    return {
                        logged_out: false,
                        error: e.code
                    }
                })
        }

    }


    public async reset_password({auth, request, view, response}: HttpContextContract) {

        if (request.method() == "POST") {

            return await User.query()
                .where('email', request.all().email)
                .firstOrFail()
                .then( async user => {

                    user.verification_code = Encryption.encrypt(user.email)
                    return await user.save()
                        .then( async usr => {

                            // Send Validation email ==========================
                            return await new ResetPassword( usr )
                                .send()
                                .then( async (response) => {
                                    return {
                                        success: true,
                                        response,
                                    }

                                } )
                                .catch( (e: EmailTransportException) => {
                                    return {
                                        meth: "email_send",
                                        success: false,
                                        message: e.message
                                    }
                                } )
                            // Send Validation email ==========================
                        })
                        .catch( err => {
                            return {
                                success: false,
                                reason: "save",
                                response: err.message
                            }
                        })
                })
                .catch( () => {
                    return {
                        success: false,
                        response: 'user'
                    }
                })

        }

        else {

            if ( await auth.check() ){
                return response.redirect().toRoute('web.my_profile')
            }


            return await User.query()
                .where('verification_code', request.qs().key)
                .firstOrFail()
                .then( user => {
                    return view.render('auth/reset_password', {
                        verification_code: user.verification_code
                    })

                    // user.email_verified = true
                    // user.verification_code = null
                    //
                    // return await user.save()
                    //     .then( () => {
                    //
                    //         return {
                    //             success: true,
                    //         }
                    //         // return await auth.use(request.qs().api ? "api": 'web' )
                    //         //     .login(usr)
                    //         //     .then( () => {
                    //         //
                    //         //         return response.redirect().toRoute( 'web.my_profile' )
                    //         //
                    //         //     })
                    //         //     .catch( error => {
                    //         //         return {
                    //         //             success: false,
                    //         //             response: error.message,
                    //         //         }
                    //         //     } )
                    //
                    //     })
                    //     .catch( err => {
                    //         return {
                    //             success: false,
                    //             response: err.message
                    //         }
                    //     })

                })
                .catch( () => {
                    return view.render('errors/not-found')
                })
        }
    }


    public async verify({request, auth, response, view}: HttpContextContract) {

        if ( request.method() === 'GET' ) {

            return await User.query()
                .where( 'verification_code', request.qs().key )
                .firstOrFail()
                .then( async user => {

                    user.verification_code = null
                    user.email_verified = true

                    return await user.save()
                        .then( () => {
                            return response.redirect().toRoute( 'web.my_profile',
                                {
                                    validated: true
                                })
                        })
                        .catch( (err) => {
                            return { error: err.message }
                        })

                } )

                .catch( () => {
                    return view.render( 'errors/not-found' )
                } )
        }

        else if ( request.method() === 'POST' ) {
            return await auth.check().then( async authenticated => {
                if ( !authenticated ) {
                    return {
                        success: false,
                        response: 'unauthenticated'
                    }
                }

                const user = auth.user as User
                return await new RegisterVerification( user )
                    .send()
                    .then( async (response) => {
                        return {
                            success: true,
                            response,
                        }

                    } )
                    .catch( (e: EmailTransportException) => {
                        return {
                            meth: "email_send",
                            success: false,
                            message: e.message
                        }
                    } )

            } )
                .catch( (e: AuthenticationException) => {
                    return {
                        success: false,
                        response: e.message
                    }
                })

        }
    }


    public async update_password({auth, request}: HttpContextContract) {

        const validation = await request.validate( {
            schema: schema.create({
                password: schema.string({}, [
                    rules.minLength(8),
                    rules.confirmed(),
                ]),
            }),
            messages: {
                'password.required': "Merci de choisir un mot de passe",
                'password.minLength': "Le mot de passe doit contenir au minimum {{ options.minLength }} caractères",
                'password_confirmation.confirmed': "Les mots de passe que vous avez saisi ne sont pas identiques"
            }

        })
            .then( () => {
                return {
                    success: true,
                }
            })
            .catch( (err: ValidationException) => {
                const validation_errors = err.messages.errors
                const errors = {}

                for ( const messageKey in validation_errors ) {
                    var message = validation_errors[messageKey]
                    errors[message.field] = message.message
                }

                return {
                    success: false,
                    response: errors,
                    reason: "validation"
                }
            } )

        // return validation

        if ( !validation.success ) {
            return validation
        }

        else {
            var user: User;

            if ( await auth.check() ){
                user = auth.user as User
            }
            else {
                user = await User.query()
                    .where('verification_code', request.all().verification_code)
                    .firstOrFail()
            }

            user.password = request.all().password
            user.verification_code = null

            return await user.save()
                .then( async () => {
                    return await auth.attempt(user.email, request.all().password)
                        .then( () => {
                            return {
                                success: true,
                            }
                        })
                        .catch( err => {
                            return {
                                success: false,
                                response: err.message,
                                reason: "auth_attemption"
                            }
                        })

                })
                .catch( err => {
                    console.log({
                        success: false,
                        response: err.message,
                        reason: "save_exception"
                    })
                })

        }

    }

}
