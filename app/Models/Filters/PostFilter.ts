import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post/Post'
import Database from "@ioc:Adonis/Lucid/Database";

export default class PostFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Post, Post>

  public post = this.$query
      .preload('category', categ => {
        categ.select('id', 'name', 'category_id')
            .preload('parent', parent => {
              parent.select('name')
            })
      })
      .preload('user', user => {
        user.select('id', 'name', 'is_pro')
      })
      .select('title', 'slug', 'condition',
          'price', 'negotiable', 'user_id', 'category_id'
      )


  public q(title: string) {
    this.post.where('title', 'Like', `%${title}%`)
  }

  public ct(city: string) {
    this.post.whereHas('city', cty => {
      cty.where('code', city)
    })
  }

  public ctg( category: string) {

    // var ids: number[] = []
    //
    // await Category.query()
    //     .preload('subs', slug => slug.select('id') )
    //     .where('slug', category)
    //     .firstOrFail()
    //
    //     .then( categ => {
    //       if (categ.subs.length){
    //         ids = categ.subs.map(sub => sub.id)
    //       }
    //       else ids.push(categ.id)
    //
    //       // this.$query.whereIn('category_id', ids)
    //     })
    //
    // ids = [ 13,14,15,16,17 ]
    // console.log(ids)

    this.post.whereIn('categoryId',
        Database
            .from('categories')
            .select('id')
            .where('slug', category)
    )
  }

  public condition(condition: string) {
    const cond = (condition == 'new') ? 'new' : condition == 'used' ? 'used': ''
    this.post.select('title', 'slug', 'condition', 'price', 'negotiable', 'user_id', 'category_id')
        .where('condition', cond)
  }

  public negotiable(negotiable: string) {
    this.post.where('negotiable', negotiable)
  }

  public prx(price: string) {
    this.post.whereBetween('price', price.split(`,`))
  }

  public featured(featured: number) {
    this.post.where('featured', featured)
  }

}
