import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";

export default class AuthController {

    public async login({auth, request}: HttpContextContract) {

        if (request.method() == "POST") {
            const log = auth.use(!request.qs().env || request.qs().env == 'api' ? 'api' : "web")

            const email = request.qs().email
            const password = request.qs().password

            return await log.attempt(email, password)
                .then(response => {
                    return {
                        token: auth.defaultGuard == "api" ? response.token : false,
                        response: auth.defaultGuard == "api" ? response.user : response
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


    public async logout({auth}: HttpContextContract) {

        const log = auth.defaultGuard ? auth : auth.use('api')

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
