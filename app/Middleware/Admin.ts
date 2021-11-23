import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import IsAdminOwnerException from "App/Exceptions/IsAdminOwnerException";

export default class Admin {
    public async handle({auth}: HttpContextContract, next: () => Promise<void>) {
        // code for middleware goes here. ABOVE THE NEXT CALL

        const isAdmin = await auth.check()
            .then(async logged => {
                const user = auth.user as User
                return logged && user.user_type === "admin"
            })

        if (!isAdmin) {
            const message = 'You are not an admin'
            const status = 403
            const errorCode = 'E_UNAUTHORIZED'

            throw new IsAdminOwnerException(message, status, errorCode)
        }

        await next()
    }
}
