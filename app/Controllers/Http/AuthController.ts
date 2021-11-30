import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import Encryption from "@ioc:Adonis/Core/Encryption";
import {Exception} from "@poppinss/utils";
import VerifyEmail from "App/Mailers/VerifyEmail";


export default class AuthController {

    public async check({auth, request}: HttpContextContract) {
        const log = auth.use(request.qs().env && request.qs().env == 'api' ? 'api' : "web")

        return {
            loggedIn: log.check()
        }
    }

    public async login({auth, request, view, response}: HttpContextContract) {

        if (request.method() == "POST") {

            const auth_field = request.all().auth_field
            const password = request.all().password

            // Check user -------------
            return User.query()
                .where('email', auth_field)
                .orWhere('username', auth_field)
                .firstOrFail()
                .then(async user => {
                    return await Hash.verify(user.password, password)

                        .then( async (valid) => {

                            // Check password -------------
                            if (valid){
                                const log = auth
                                    .use(request.all().env && request.all().env == 'api'
                                        ? 'api' : "web"
                                    )

                                return await log.attempt(user.email, password)
                                    .then(response => {

                                        return {
                                            user: auth.user,
                                            success: true,
                                            token: auth.defaultGuard == "api" ? response.token : false,
                                        }

                                    })
                                    .catch(e => {
                                        return {
                                            success: false,
                                            error: e.message
                                        }
                                    })
                            }
                            else {
                                return {
                                    success: false,
                                    error: "pass_incorrect"
                                }
                            }

                        })
                        .catch( (error) => {
                            return {
                                success: false,
                                error
                            }
                        })

                })
                .catch( (error) => {
                    return {
                        success: false,
                        error: error.code
                    }
                })


        }

        else {
            if (await auth.check()) {
                return response.redirect('/')
            }
            else {
                return view.render('auth/login')
            }
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

            return auth.check()
                .then( async authenticated => {

                    var email = ""

                    if (JSON.parse(request.all().guest)) {
                        email = request.all().email
                    }
                    else {
                        if (!authenticated) {
                            return {
                                success: false,
                                message: "not_authenticated"
                            }
                        }

                        const usr = auth.user as User
                        email = usr.email
                    }

                    return await User.query()
                        .where('email', email)
                        .firstOrFail()
                        .then( async user => {
                            user.verification_code = Encryption.encrypt(user.email)

                            return user.save()
                                .then(async (user) => {

                                    const hashed = await Hash.make(request.all().password)
                                        .then( async hashed_password => {
                                            return hashed_password
                                        })

                                        .catch( () => {
                                            return null
                                        })

                                    return await new VerifyEmail(user, request.all().password ? hashed : null, JSON.parse(request.all().guest))
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
                                                error: err.message,
                                                type: "email"
                                            }
                                        })
                                })

                                .catch( error => {
                                    return {
                                        success: false,
                                        message: error.message
                                    }
                                })

                        })

                        .catch( error => {
                            return {
                                success: false,
                                message: error.code
                            }
                        })

                })

                .catch( (error: AuthenticationException) => {
                    return {
                        success: false,
                        message: error.message
                    }
                })

        }

        else {

            const authenticated = await auth.check()
                .then( checked => {
                    return checked
                })

                .catch( (error: AuthenticationException) => {
                    console.log(error.message)
                    return false
                })

            if (authenticated){
                return response.redirect().toRoute('web.my_profile')
            }

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


    public async update_password({auth, request, response}: HttpContextContract) {

        const errors = {
            length: request.all().password.trim() !== null && request.all().password.length >= 8,
            match_ok: request.all().password_confirmation === request.all().password
        }

        if (!errors.length){
            return {
                success: false,
                message: "length_ko"
            }
        }

        if (!errors.match_ok){
            return {
                success: false,
                message: "no_match"
            }
        }

        return await auth.check()
            .then( async authenticated => {

                if (authenticated) {
                    return response.redirect('/mon-profil')
                }

                else {
                    return await User.query()
                        .where('verification_code', request.all().verification_code)
                        .firstOrFail()
                        .then( async user => {

                            user.password = await Hash.make(request.all().password)
                            user.verification_code = null

                            return user.save()
                                .then(() => {

                                    return auth.attempt(user.email, request.all().password)
                                        .then( () => {
                                            return {
                                                success: true
                                            }
                                        })
                                        .catch( (error) => {
                                            return {
                                                method: 'AuthController@update_password_login_attemption',
                                                success: false,
                                                message: error.message
                                            }
                                        })


                                })

                                .catch( (error) => {
                                    return {
                                        method: 'AuthController@update_password_user_save',
                                        success: false,
                                        message: error.message
                                    }
                                })

                        })

                }


            })
            .catch( (error: AuthenticationException) => {
                return {
                    method: 'AuthController@update_password_authExce',
                    success: false,
                    message: error.message
                }
            })
    }

}
