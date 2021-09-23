import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Post from 'App/Models/Post/Post'
import Category from '../Category'

export default class PostFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Post, Post>


  public q(title: string) {
    this.$query.where('title', 'Like', '%' + title + '%')
  }

  public user(user: string) {
    this.$query.where('user_id', user)
  }

  public valid(is_valid: number) {
    this.$query.where('is_valid', is_valid)
  }

  public commune(city: string) {
    this.$query.whereHas('city', cty => {
      cty.where('code', city)
    })
  }

  public async ctg(ctg: string) {

    const category =  Category.query()
            .where('slug', ctg)
            .preload('subs')
            .firstOrFail()

            .then((result) => {
              if (result.subs.length) {

                this.$query.whereHas('category', categ => {
                  const slugs = result.subs.map(sub => sub.slug)
                  categ.whereIn('slug', slugs)

                })

              }
              else {

                this.$query.whereHas('category', categ => {
                  categ.where('slug', ctg)
                })
                
              }
            });


    return this.$query.whereHas('category', categ => {

        // if (category.subs.length) {
          
        //     const slugs = category.subs.map(sub => sub.slug)
        //     categ.whereIn('slug', slugs)
        // }
        // else categ.where('slug', ctg)

        // const slugs = category.subs.map(sub => sub.slug)
        // categ.whereIn('slug', slugs)
        
    })
    
  }

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
