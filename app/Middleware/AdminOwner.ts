import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import IsAdminOwnerException from "App/Exceptions/IsAdminOwnerException";

export default class AdminOwner {
    public async handle({auth, params}: HttpContextContract, next: () => Promise<void>) {
        // code for middleware goes here. ABOVE THE NEXT CALL

        const isOwnerOrAdmin = await auth.check()
            .then(async logged => {
                const user = auth.user as User
                await user.load('posts')
                const isOwner = user.posts
                    .map(post => post.slug)
                    .includes(params.id)

                return logged && (user.user_type === "admin" || isOwner)
            })

        if (!isOwnerOrAdmin) {
            const message = 'You are not admin neither the owner of this post'
            const status = 403
            const errorCode = 'E_UNAUTHORIZED'

            throw new IsAdminOwnerException(message, status, errorCode)
        }

        await next()
    }
}
