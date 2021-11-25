import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import Encryption from "@ioc:Adonis/Core/Encryption";
import {Exception} from "@poppinss/utils";
import VerifyEmail from "App/Mailers/VerifyEmail";
import {EmailTransportException} from "@adonisjs/mail/build/src/Exceptions/EmailTransportException";
import {req} from "pino-std-serializers";

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


    public async reset_password({auth, request}: HttpContextContract) {

        if (request.method() == "POST") {

            return auth.check()
                .then( async authenticated => {

                    if (!authenticated) {
                        return {
                            success: false,
                            message: "not_authenticated"
                        }
                    }

                    const user = auth.user as User
                    user.verification_code = Encryption.encrypt(user.email)

                    return user.save()
                        .then(async (user) => {
                            return await Hash.make(request.all().password)
                                .then( async hashed_password => {

                                    return await new VerifyEmail(user, hashed_password)
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
                                message: error.message
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

            return await User.query()
                .where('verification_code', request.qs().key)
                .firstOrFail()
                .then( user => {
                    user.verification_code = null
                    user.password = request.qs().npss

                    return user.save()
                })
                .catch( (error: Exception) => {
                    return {
                        success: false,
                        message: error.message
                    }
                })

        }
    }
}
