import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import City from "App/Models/City";

export default class HomeController {

    public async index ({view, auth}: HttpContextContract) {
        console.log(auth.user)

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
            .pojo()
            .orderBy('posts_count', 'desc')
            .limit(14)

        // return {
        //     sub_categories: sub_categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
        //     // @ts-ignore
        //     cities: cities.sort( (a,b) => b.posts_count - a.posts_count),
        // }

        return view.render('home',{
            sub_categories: sub_categories.sort( (a,b) => b.$extras.posts_count - a.$extras.posts_count),
            // @ts-ignore
            // top_cities: cities.sort( (a,b) => b.posts_count - a.posts_count),
            cities,
        })
    }
}
