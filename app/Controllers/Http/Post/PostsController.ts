import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import Application from "@ioc:Adonis/Core/Application";
import PostReview from "App/Models/Post/PostReview";
import PostReport from "App/Models/Post/PostReport";
import PostGallery from "App/Models/Post/PostGallery";
import PostValidator from "App/Validators/Post/PostValidator";
import {Exception} from "@poppinss/utils";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import User from "App/Models/User";

export default class PostsController {

    protected ids: number[]

    public async index({request}: HttpContextContract) {
        return await Post.filter(request.qs())
            .paginate(1, 20)
    }

    public async create({}: HttpContextContract) {
    }

    public async store({request}: HttpContextContract) {

        return await request.validate(PostValidator)
            .then(async (response: Object) => {

                return await Post.create(response)
                    .then(post => {
                        const images = request.files('images')
                        if (images.length) {

                            images.forEach(image => {
                                const path = Application.publicPath('uploads/posts/' + post.slug)
                                image.move(path)
                                    .then(async () => {
                                        post.related('images').create({
                                            path: '/uploads/post/' + post.slug + "/" + image.clientName
                                        })
                                    })
                                    .catch((err: Exception) => {
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
                    .catch((err: Exception) => {
                        return {
                            success: false,
                            message: err.code,
                        }
                    })

            })

            .catch((err: ValidationException) => {
                return {
                    success: false,
                    message: err.messages,
                }
            })
    }


    public async show({params}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.id)
            .firstOrFail()
            .then(async post => {
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
            .catch(async (e: Exception) => {
                return {
                    success: false,
                    error: e.code,
                }
                // return await view.render('errors.not-found')
            })
    }


    public async edit({params, view}: HttpContextContract) {
        try {
            const post = await Post.query().where('slug', params.id).firstOrFail()
            return {post}
        } catch (ex) {
            return await view.render('errors.not-found')
        }
    }


    public async update({request, params}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.id)
            .firstOrFail()
            .then(async post => {
                return await request.validate(PostValidator)
                    .then(async (resp: Object) => {

                        return await post.merge(resp)
                            .save()
                            .then(post => {
                                return {
                                    success: true,
                                    post
                                }
                            })
                            .catch((err: Exception) => {
                                return {
                                    success: false,
                                    error: err.code,
                                }
                            })

                    })
                    .catch((err: ValidationException) => {
                        return {
                            success: false,
                            error: err.messages,
                        }
                    })

            })
            .catch((err: Exception) => {
                return {
                    success: false,
                    message: err.code,
                }
            })
    }


    public async destroy({params}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.id)
            .firstOrFail()
            .then(async post => {
                return await post.delete()
                    .then(async () => {
                        await PostReview.query().where('post_id', post.id)
                            .then((reviews) => {
                                reviews.forEach((review) => {
                                    review.delete()
                                })
                            })

                        await PostReport.query().where('post_id', post.id)
                            .then((reports) => {
                                reports.forEach((report) => {
                                    report.delete()
                                })
                            })

                        await PostGallery.query().where('post_id', post.id)
                            .then((images) => {
                                images.forEach((image) => {
                                    image.delete()
                                })
                            })

                        return {
                            success: true,
                            result: post
                        }
                    })
                    .catch((e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    })


            })
            .catch((err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            })

    }

    public async restore({params}: HttpContextContract) {
        return await Post.onlyTrashed()
            .where('slug', params.slug)
            .firstOrFail()
            .then(async post => {
                return await post.restore()
                    .then(async () => {
                        await PostReview.onlyTrashed().where('post_id', post.id)
                            .then((reviews) => {
                                reviews.forEach((review) => {
                                    review.restore()
                                    post.preload('reviews')
                                })
                            })

                        await PostReport.onlyTrashed().where('post_id', post.id)
                            .then((reports) => {
                                reports.forEach((report) => {
                                    report.restore()
                                    post.preload('reports')
                                })
                            })

                        await PostGallery.onlyTrashed().where('post_id', post.id)
                            .then((images) => {
                                images.forEach((image) => {
                                    image.restore()
                                    post.preload('images')
                                })
                            })

                        return {
                            success: true,
                            result: post
                        }
                    })
                    .catch((e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    })
            })
            .catch((err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            })
    }

    public async forceDelete({params}: HttpContextContract) {
        return await Post.onlyTrashed()
            .where('slug', params.slug)
            .firstOrFail()
            .then(async post => {
                return await post.forceDelete()
                    .then(async () => {
                        await PostReview.onlyTrashed().where('post_id', post.id)
                            .then((reviews) => {
                                reviews.forEach((review) => {
                                    review.forceDelete()
                                })
                            })

                        await PostReport.onlyTrashed().where('post_id', post.id)
                            .then((reports) => {
                                reports.forEach((report) => {
                                    report.forceDelete()
                                })
                            })

                        await PostGallery.onlyTrashed().where('post_id', post.id)
                            .then((images) => {
                                images.forEach((image) => {
                                    image.forceDelete()
                                })
                            })

                        return {
                            success: true,
                            result: post
                        }
                    })
                    .catch((e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    })


            })
            .catch((err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            })
    }

    public async addToFavourite({params, request}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.slug)
            .withCount('favourites', user => {
                user.wherePivot('user_id', request.qs().user)
                    .select()
            })
            .select([
                'id', 'user_id', 'slug', 'title',
            ])
            .firstOrFail()
            .then(async post => {

                if (!post.$extras.favourites_count) {

                    return await User.findOrFail(request.qs().user)
                        .then( async user => {
                            return await post.related('favourites').attach([user.id])
                                .then( () => {
                                    return {
                                        success: true,
                                        result: 'attached',
                                    }
                                })

                                .catch( (err: Exception) => {
                                    return {
                                        success: false,
                                        result: err.code,
                                        model: 'attach'
                                    }
                                })

                        })
                        .catch( (err: Exception) => {
                            return {
                                success: false,
                                result: err.code,
                                model: 'user'
                            }
                        })
                }

                else {
                    return {
                        success: false,
                        result: 'already_attached'
                    }
                }

            })
            .catch( (e: Exception) => {
                return {
                    success: false,
                    result: e.message
                }
            })

    }
}
