import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import Encryption from "@ioc:Adonis/Core/Encryption";
import {Exception} from "@poppinss/utils";
// import VerifyEmail from "App/Mailers/VerifyEmail";


export default class AuthController {

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
                        .then( usr => {
                            // Send Validation email ==========================

                            // Send Validation email ==========================

                            return {
                                success: true,
                                response: usr
                            }
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
                        reason: "auth",
                        response: 'user'
                    }
                })

        }

        else {

            if ( await auth.check() ){

                // if ( auth.defaultGuard == "api" ) {
                //     return {
                //         success: false,
                //         response: 'authenticated'
                //     }
                // }

                return response.redirect().toRoute('web.my_profile')
            }


            return await User.query()
                .where('verification_code', request.qs().key)
                .firstOrFail()
                .then( async user => {

                    user.email_verified = true
                    user.verification_code = null

                    return await user.save()
                        .then( async usr => {

                            return await auth.use(request.qs().api ? "api": 'web' )
                                .login(usr)
                                .then( () => {

                                    return response.redirect().toRoute( 'web.my_profile' )

                                })
                                .catch( error => {
                                    return {
                                        success: false,
                                        response: error.message,
                                    }
                                } )

                        })
                        .catch( err => {
                            return {
                                success: false,
                                response: err.message
                            }
                        })

                })
                .catch( () => {
                    return {
                        success: false,
                        response: 'not_found'
                    }
                })

            return await User.query()
                .where('verification_code', request.qs().key)
                .firstOrFail()
                .then( async user => {

                    if (request.qs().q == 'rst'){
                        user.verification_code = null
                        user.password = request.qs().npss

                        return await user.save()
                            .then( () => {
                                return response.redirect('/mon-profil/infos')
                            })
                    }

                    else if (request.qs().q == 'ui_rst'){
                        return view.render('auth/reset_password', {
                            verification_code: user.verification_code
                        })
                    }

                    else return response.redirect().toRoute('web.my_profile')

                })
                .catch( (error: Exception) => {
                    return {
                        success: false,
                        message: error.message
                    }
                })

        }
    }


    public async verify({request, auth, response}: HttpContextContract) {

        return await User.query()
            .where('verification_code', request.qs().key)
            .firstOrFail()
            .then(async user => {
                user.verification_code = null
                user.email_verified = true

                if (await auth.check().then(checked => {return checked}) ){
                    user.password = request.qs().npss
                }

                return await user.save()
                    .then(async () => {

                        if (await auth.check().then(checked => {return checked}) ){
                            return response.redirect('/mon-profil/infos')
                        }

                        return auth.login(user)
                            .then( () => {
                                return response.redirect('/mon-profil/infos')
                            })

                    })
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


    public async update_password({auth, request}: HttpContextContract) {

        if (!request.all().password){
            return {
                success: false,
                message: "pass_null"
            }
        }

        if (request.all().password.length < 8){
            return {
                success: false,
                message: "length_ko"
            }
        }

        if (request.all().password_confirmation !== request.all().password){
            return {
                success: false,
                message: "no_match"
            }
        }

        const logged_in = await auth.check()
            .then( async authenticated => {
                return authenticated
            })
            .catch( err => {
                console.log(err.message)
            })

        const user_response = logged_in ?
            {
                success: true,
                response: auth.user as User
            } :
            await User.query()
                .where('verification_code', request.all().verification_code)
                .firstOrFail()
                .then(usr => {
                    return {
                        success: true,
                        response: usr
                    }
                })
                .catch( err => {
                    return {
                        success: false,
                        response: err.message
                    }
                })

        if (user_response.success){
            const user = user_response.response

            user.password = await Hash.make(request.all().password)
            user.verification_code = null

            return user.save()
                .then( user => {
                    return {
                        success: true,
                        response: user
                    }
                })
                .catch( err => {
                    return {
                        success: false,
                        response: err.message
                    }
                })
        }

        else {
            return {
                success: false,
                response: user_response.response
            }
        }

    }

}
