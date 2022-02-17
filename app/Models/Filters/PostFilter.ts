import {BaseModelFilter} from '@ioc:Adonis/Addons/LucidFilter'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post/Post'
import User from "App/Models/User";
import Category from "App/Models/Category";
import Department from "App/Models/Department";
import City from "App/Models/City";
import Database from "@ioc:Adonis/Lucid/Database";

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
        .preload('pictures', images => {
            images.select('path', "postId")
                .first()
        })
        .select('id', 'title', 'slug', 'condition',
            'price', 'negotiable', 'user_id', 'category_id', 'city_id', 'created_at'
        )

    public keyword(title: string) {
        this.post.where('title', 'Like', `${title}%`)
    }

    public orderBy(key: string) {
        this.post.orderBy(key)
    }

    public cty(city_code: string) {
        const city_id = Database
            .from('cities')
            .select('id')
            .where('code', city_code)

        this.post.where('city_id', city_id)
    }

    public dpt(department_code: string) {
        const department_id = Department.query()
            .where('code', department_code)
            .select('id')

        const city_id = City.query()
            .where('department_id', department_id)
            .select('id')

        this.post.whereIn('city_id', city_id)
    }

    public reason(reason: string) {
        this.post.where('reason', reason)
    }

    public pctg(category_code: string) {

        const category_id = Category.query()
            .where('slug', category_code)
            .select('id')

        const children_ids = Category.query()
            .where('category_id', category_id)
            .select('id')

        this.post.whereIn('category_id', children_ids)
    }

    public ctg(category_code: string) {

        const category_id = Category.query()
            .select('id')
            .where('slug', category_code)

        this.post.where('category_id', category_id)

    }

    public cndt(condition: string) {
        const cond = ['new', 'used'].includes(condition) ? condition : ''
        this.post.where('condition', cond)
    }

    public negotiable(negotiable: string) {
        this.post.where('negotiable', JSON.parse(negotiable))
    }

    public prx(price: string) {
        const prix = price.split(`,`)
            .map(prx => Number.parseInt(prx))

        // @ts-ignore
        this.post.whereBetween('price', prix)
    }

    public minprx(price: string) {
        this.post.where('price', '>=', Number.parseInt(price))
    }

    public maxprx(price: string) {
        this.post.where('price', '<=', Number.parseInt(price))
    }

    public featured(featured: string) {
        this.post.where('featured', Number.parseInt(featured))
    }

    public seller(pro: string){

        const user_id = User.query()
            .select('id')
            .where('is_pro', pro == 'pro')

        this.post.whereIn('user_id', user_id)
    }

}
