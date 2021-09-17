import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import {HttpException} from "@adonisjs/http-server/build/src/Exceptions/HttpException";
import Application from "@ioc:Adonis/Core/Application";

export default class PostsController {

    public async index ({request}: HttpContextContract) {
        const posts = await Post.query()
            .preload('user', builder => {
                builder.select('is_pro')
            })
            .preload('city',builder => {
                builder
                    .select('name', 'department_id')
                    .preload('department', builder => {
                        builder.select('name')
                    })
            })
            .preload('category', builder => {
                builder.select('name', 'category_id')
                    .preload('parent', builder => {
                        builder.select('name')
                    })
            })
            .select('id', 'user_id', 'category_id', 'city_id',
                'title', 'price', 'negotiable'
            )
            .paginate(request.qs().page, 10)

        return { posts }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request}: HttpContextContract) {
      try {
          const exist_post = await Post.query().where('title', request.qs().title)
          if (exist_post.length) {
              return {
                  error: "Une autre annonce avec le même titre déjà existe."
              }
          }

          const post = await Post.create(request.all())
          if (post) {
              const images = request.files('images')
              if (images) {
                  images.forEach(image => {
                      const path = Application.publicPath('uploads/posts/' + post.slug)
                      image.move(path)

                      post.related('images').create({
                          path: '/uploads/post/' + post.slug + "/" + image.clientName
                      })

                  })
              }
          }
          else return {
              error: "error lors de la creation"
          }

          return {post}
      }
      // @ts-ignore
      catch (e: HttpException) {
          return { error: e.code }
      }
  }

  public async show ({params, view}: HttpContextContract) {
      try {
          const post = await Post.query()
              .where('slug', params.id)
              .first()

          await post?.load('images', image => {
              image.select('path')
          })
          await post?.load('reviews', review => {
              review
                  .preload('user', user => {
                      user.select('name', 'picture')
                  })
          })
          await post?.load('user', user => {
              user.select('name', 'is_pro')
          })

          return {
              post,
          }
      } catch (e) {
          return await view.render('errors.not-found')
      }
  }

  public async edit ({params, view}: HttpContextContract) {
      try {
          const post = await Post.query().where('slug', params.id).firstOrFail()
          return { post }
      }
      catch (ex) {
          return await view.render('errors.not-found')
      }
  }

  public async update ({request, params}: HttpContextContract) {
      try {
          const post = await Post.query()
              .where('id', params.id).firstOrFail()

          await post.merge(request.all()).save()
          return {post}
      }
      // @ts-ignore
      catch (e: HttpException) {
          return { error: e.code }
      }
  }

  public async destroy ({params}: HttpContextContract) {
      try {
          const post = await Post.findOrFail(params.id)
          await post.delete()
          return {post}
      }
      // @ts-ignore
      catch (e: HttpException) {
          return { error: e.code }
      }
  }
}
