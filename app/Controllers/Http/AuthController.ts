import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";

export default class AuthController {

    public async login({auth, request}: HttpContextContract) {

        if (request.method() == "POST") {
            const log = (request.qs().env && request.qs().env == 'web') ? auth
                : auth.use('api')

            const email = request.qs().email
            const password = request.qs().password

            return await log.attempt(email, password)
                .then(response => {
                    return {
                        token: (!request.qs().env || request.qs().env == 'api') ? response.token : false,
                        user: !request.qs().env ? response.user : response
                    }
                })
                .catch(e => {
                    return {error: e.message}
                })
        } else {

            return {
                error: "your not logged in"
            }

        }
    }


    public async logout({auth, request}: HttpContextContract) {

        const log = (request.qs().env && request.qs().env == 'web') ? auth
            : auth.use('api')

        return await log.check()
            .then( async check => {

                if (check) {
                    return await log.logout()
                        .then(() => {
                            return {
                                logged_out: true,
                            }
                        })
                        .catch(e => {
                            return {error: e.message}
                        })
                } else {
                    return {
                        logged_out: false,
                    }
                }
            })
            .catch((e: AuthenticationException) => {
                return { error: e}
            })
    }
}
