import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import Application from "@ioc:Adonis/Core/Application";
import PostReview from "App/Models/Post/PostReview";
import PostReport from "App/Models/Post/PostReport";
import PostGallery from "App/Models/Post/PostGallery";
import PostValidator from "App/Validators/PostValidator";
import {Exception} from "@poppinss/utils";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";

export default class PostsController {

    public async index ({request}: HttpContextContract) {

        return await Post.query()
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
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request}: HttpContextContract) {

        return await request.validate(PostValidator)
            .then( async (response: Object) => {

                return await Post.create(response)
                    .then( post => {
                        const images = request.files('images')
                        if (images.length) {

                            images.forEach(image => {
                                const path = Application.publicPath('uploads/posts/' + post.slug)
                                image.move(path)
                                    .then( async () => {
                                        post.related('images').create({
                                            path: '/uploads/post/' + post.slug + "/" + image.clientName
                                        })
                                    })
                                    .catch( (err: Exception) => {
                                        return {
                                            success: false,
                                            message: err.code,
                                        }
                                    })

                            })

                        }

                        return {
                            success: true,
                            message: post,
                        }
                    })
                    .catch( (err: Exception) => {
                        return {
                            success: false,
                            message: err.code,
                        }
                    })

            })

            .catch( (err: ValidationException) => {
                return {
                    success: false,
                    message: err.messages,
                }
            })
  }


  public async show ({params}: HttpContextContract) {
      return await Post.query()
          .where('slug', params.id)
          .firstOrFail()
          .then( async post => {
              await post.load('images', image => {
                  image.select('path')
              })
              await post.load('reviews', review => {
                  review.preload('user', user => {
                      user.select('name', 'picture')
                  })
              })
              await post.load('user', image => {
                  image.select('patname', 'is_proh')
              })

              return {
                  success: true,
                  post
              }
          })
          .catch( async (e: Exception) => {
              return {
                  success: false,
                  error: e.code,
              }
              // return await view.render('errors.not-found')
          })
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
        return await Post.query()
            .where('slug', params.id)
            .firstOrFail()
            .then( async post => {
                return await request.validate(PostValidator)
                    .then( async (resp: Object) => {

                        return await post.merge(resp)
                            .save()
                            .then( post => {
                                return {
                                    success: true,
                                    post
                                }
                            })
                            .catch( (err: Exception) => {
                                return {
                                    success: false,
                                    error: err.code,
                                }
                            })

                    })
                    .catch( (err: ValidationException) => {
                        return {
                            success: false,
                            error: err.messages,
                        }
                    })

            })
            .catch( (err: Exception) => {
                return {
                    success: false,
                    message: err.code,
                }
            })
  }


  public async destroy ({params}: HttpContextContract) {
      return await Post.query()
          .where('slug', params.id)
          .firstOrFail()
          .then( async post => {
              return await post.delete()
                  .then( async () => {
                      await PostReview.query().where('post_id', post.id)
                          .then( (reviews) => {
                              reviews.forEach( (review) => {
                                  review.delete()
                              })
                          })

                      await PostReport.query().where('post_id', post.id)
                          .then( (reports) => {
                              reports.forEach( (report) => {
                                  report.delete()
                              })
                          })

                      await PostGallery.query().where('post_id', post.id)
                          .then( (images) => {
                              images.forEach( (image) => {
                                  image.delete()
                              })
                          })

                      return {
                          success: true,
                          result: post
                      }
                  })
                  .catch( (e: Exception) => {
                      return {
                          success: false,
                          result: e.code
                      }
                  })


          })
          .catch( (err: Exception) => {
              return {
                  success: false,
                  result: err.code
              }
          })

  }

  public async restore ({params}: HttpContextContract) {
        return await Post.onlyTrashed()
            .where('slug', params.slug)
            .firstOrFail()
            .then( async post => {
                return await post.restore()
                    .then( async () => {
                        await PostReview.onlyTrashed().where('post_id', post.id)
                            .then( (reviews) => {
                              reviews.forEach( (review) => {
                                  review.restore()
                                  post.preload('reviews')
                              })
                          })

                        await PostReport.onlyTrashed().where('post_id', post.id)
                            .then( (reports) => {
                              reports.forEach( (report) => {
                                  report.restore()
                                  post.preload('reports')
                              })
                          })

                        await PostGallery.onlyTrashed().where('post_id', post.id)
                            .then( (images) => {
                              images.forEach( (image) => {
                                  image.restore()
                                  post.preload('images')
                              })
                          })

                        return {
                          success: true,
                          result: post
                        }
                    })
                    .catch( (e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    })
            })
            .catch( (err: Exception) => {
              return {
                  success: false,
                  result: err.code
              }
            })
  }

  public async forceDelete({params} : HttpContextContract) {
        return await Post.onlyTrashed()
            .where('slug', params.slug)
            .firstOrFail()
            .then( async post => {
                return await post.forceDelete()
                    .then( async () => {
                        await PostReview.onlyTrashed().where('post_id', post.id)
                            .then( (reviews) => {
                                reviews.forEach( (review) => {
                                    review.forceDelete()
                                })
                            })

                        await PostReport.onlyTrashed().where('post_id', post.id)
                            .then( (reports) => {
                                reports.forEach( (report) => {
                                    report.forceDelete()
                                })
                            })

                        await PostGallery.onlyTrashed().where('post_id', post.id)
                            .then( (images) => {
                                images.forEach( (image) => {
                                    image.forceDelete()
                                })
                            })

                        return {
                            success: true,
                            result: post
                        }
                    })
                    .catch( (e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    })


            })
            .catch( (err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            })

    }
}
