import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";

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
}
