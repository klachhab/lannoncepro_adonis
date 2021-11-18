import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import City from "App/Models/City";
import User from "App/Models/User";

export default class HomeController {

    public async index ({view, auth}: HttpContextContract) {
        console.log(auth.user)

        const unread_messages_count = await auth.check()
            .then( async logged_in => {
                if (logged_in) {
                    const user = auth.user as User

                    const posts = await user.related('posts')
                        .query()
                        .has('conversations')
                        .preload('conversations', conversation => {
                            conversation.select('id', 'postId', 'read')
                        })

                    return posts.filter(post => post.has_unread_message == true).length
                }
            })

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
        // .pojo()

        const cities = await City.query()
            .withCount('posts', posts => {
                posts.where('is_valid', 1)
            })
            .select('id', 'name', 'code')
            .orderBy('posts_count', 'desc')
            .limit(14)

        // return {
        //     sub_categories: sub_categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
        //     cities: cities.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
        //     unread_messages_count
        // }

        return view.render('home',{
            sub_categories: sub_categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
            cities: cities.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
            unread_messages_count
        })
    }
}
