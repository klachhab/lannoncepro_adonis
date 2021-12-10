import {BaseModelFilter} from '@ioc:Adonis/Addons/LucidFilter'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post/Post'
import Database from "@ioc:Adonis/Lucid/Database";
import City from "App/Models/City";

export default class PostFilter extends BaseModelFilter {
    public $query: ModelQueryBuilderContract<typeof Post, Post>

    public post = this.$query
        .where('is_valid', 1)
        .preload('category', category => {
            category.select('id', 'name', 'category_id', 'slug')
                .preload('parent', parent => {
                    parent.select('name')
                })
        })
        .preload('user', user => {
            user.select('id', 'name', 'is_pro')
        })
        .preload('city', user => {
            user.preload('department', department => {
                department.select('id', 'name', 'code')
            })
                .select('id', 'name', 'code', 'departmentId')
        })
        .preload('images', images => {
            images.select('path', "postId")
                .first()
        })
        .select('id', 'title', 'slug', 'condition','is_valid',
            'price', 'negotiable', 'user_id', 'category_id', 'city_id'
        )


    public q(title: string) {
        this.post
            .andWhere('title', 'Like', `${title}%`)
    }

    public cty(city_code: string) {
        const city_id = Database
            .from('cities')
            .select('id')
            .where('code', city_code)

        this.post.where('city_id', city_id)
    }

    public dpt(department_code: string) {
        const department_id = Database
            .from('departments')
            .select('id')
            .where('code', department_code)

        const city_id = Database
            .from('cities')
            .where('department_id', department_id)
            .select('id')

        this.post.whereIn('city_id', city_id)
    }

    public pctg(category_code: string) {

        const category_id = Database
            .from('categories')
            .where('slug', category_code)
            .select('id')

        const children_ids = Database
            .from('categories')
            .where('category_id', category_id)
            .select('id')

        console.log(children_ids)
        this.post.whereIn('category_id', children_ids)
    }

    public ctg(category_code: string) {

        const category_id = Database
            .from('categories')
            .select('id')
            .where('slug', category_code)

        this.post.where('category_id', category_id)

    }

    public cndt(condition: string) {
        const cond = (condition == 'new') ? 'new' : condition == 'used' ? 'used' : ''
        this.post.where('condition', cond)
    }

    public negotiable(negotiable: string) {
        this.post.where('negotiable', negotiable)
    }

    public prx(price: string) {
        // @ts-ignore
        this.post.whereBetween('price', price.split(`,`))
    }

    public featured(featured: number) {
        this.post.where('featured', featured)
    }

}
