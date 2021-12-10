import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";

export default class HomeController {

    public async index ({view, auth}: HttpContextContract) {
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
}
