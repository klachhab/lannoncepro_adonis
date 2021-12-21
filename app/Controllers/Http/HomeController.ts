import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import User from "App/Models/User";
import {Exception} from "@poppinss/utils";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import Post from "App/Models/Post/Post";

export default class HomeController {

    public async index ({view}: HttpContextContract) {
        const sub_categories = await Category.query()
            .has('parent')
            .preload('parent', parent => {
                parent.select('name', 'id')
            })
            .withCount('posts', posts => {
                posts.where('is_valid', 1)
            })
            .select('id', 'name', 'slug')
            .limit(15)

        return view.render('home',{
            sub_categories: sub_categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
            // cities: cities.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
        })
    }

    public async messagesCount( {auth}: HttpContextContract) {

        return await auth.check()
            .then(async checked => {

                if (checked) {

                    const user = auth.user as User

                    const conversations = await user
                        .related('conversations')
                        .query()
                        .where('read', false)
                        .select('read')

                    return {
                        success: true,
                        unread_messages: conversations.length
                    }

                }
                return {
                    success: false,
                }


            })
            .catch((error: AuthenticationException) => {
                return {
                    success: false,
                    error: error.message
                }
            })

    }


    public async filterHome({request}: HttpContextContract) {
        // return request.qs();

        const posts = await Post.filter(request.qs())
        return posts.length

    }
}
