import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
    public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        const authenticated = await auth.check()
            .then(logged => {
                return logged
            })

        if (authenticated) {
            response.status(404)
            return
        }

        await next()
    }
}
