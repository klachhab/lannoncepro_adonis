import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Category from "App/Models/Category";

export default class CategoriesController {

    public async index ({}: HttpContextContract) {
        return await Category.query()
            .has('subs')
            .preload('subs')
    }


    public async show({request}: HttpContextContract) {
        const category = await Category.query()
            .doesntHave('parent')
            .where('slug', request.all().slug)
            .preload('subs', subs => {
                subs.select('name', 'id', 'slug', 'categoryId')
            })
            .select()
            .firstOrFail()
            .then(category => {
                return category
            })
            .catch(err => {
                return err.code
            })

        return category.subs
    }


}
