import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import Application from "@ioc:Adonis/Core/Application";
import PostGallery from "App/Models/Post/PostGallery";
import PostValidator from "App/Validators/Post/PostValidator";
import {Exception} from "@poppinss/utils";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import User from "App/Models/User";
import ReviewValidator from "App/Validators/Post/ReviewValidator";
import ReportValidator from "App/Validators/Post/ReportValidator";

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
                await post.load('reviews', user => {
                    user.select('name', 'picture')
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
                        // await post.related('favourites').detach()
                        // await post.related('reports').detach()
                        // await post.related('reviews').detach()

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
                        /*await PostReview.onlyTrashed().where('post_id', post.id)
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
                            })*/

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
                        return {
                            success: true,
                            result: "forceDeleted"
                        }
                    })
                    .catch( e => {
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
            .select(['id'])
            .withCount('favourites', favourites => {
                favourites.wherePivot('user_id', request.qs().user)
            })
            .firstOrFail()
            .then(async post => {
                return await User.findOrFail(request.qs().user)
                    .then( async user => {
                        // return user
                        const favourites = await post.related('favourites')

                        if (!post.$extras.favourites_count) {

                            return favourites
                                .attach([user.id])
                                .then( () => {
                                    return {
                                        success: true,
                                        result: 'attached'
                                    }
                                })
                                .catch( err => {
                                    return {
                                        success: false,
                                        error: err.code,
                                    }
                                })

                        }

                        else {
                            return favourites
                                .detach([user.id])
                                .then( () => {
                                    return {
                                        success: true,
                                        result: 'detached'
                                    }
                                })

                                .catch( err => {
                                    return {
                                        success: false,
                                        error: err.code,
                                    }
                                })
                        }

                    })
                    .catch( () => {
                        return {
                            success: false,
                            error: 'user_not_fount',
                        }
                    })

            })
            .catch( () => {
                return {
                    success: false,
                    result: 'post_not_fount',
                }
            })

    }

    public async addReview({params, request}: HttpContextContract) {

        return await request.validate(ReviewValidator)

            .then( async valid_review => {

                return await Post.query()
                    .where('slug', params.slug)
                    .withCount('reviews', user => {
                        user.wherePivot('user_id', valid_review.user)
                    })
                    .preload('reviews', reviews => {
                        reviews
                            .wherePivot('user_id', valid_review.user)
                            .select('name')
                    })
                    .select([
                        'user_id', 'slug', 'title',
                    ])
                    .firstOrFail()
                    .then( async post => {

                        return await User.findOrFail(valid_review.user)
                            .then( async user => {

                                if (!post.$extras.reviews_count) {

                                    return await post.related('reviews').attach({
                                        [user.id]: {
                                            comment: valid_review.comment,
                                            rating: valid_review.rating,
                                        }
                                    })
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
                                                model: 'reviews_attach'
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

                            .catch( () => {
                                return {
                                    success: false,
                                    result: 'user_not_fount',
                                }
                            })

                    })
                    .catch( () => {
                        return {
                            success: false,
                            result: 'post_not_fount',
                        }
                    })

            })
            .catch( (e: ValidationException) => {
                return e.messages
            })

    }


    public async addReport({params, request}: HttpContextContract) {

        return await request.validate(ReportValidator)

            .then( async valid_report => {

                return await Post.query()
                    .where('slug', params.slug)
                    .select(['id'])
                    .withCount('reports', reports => {
                        reports .wherePivot('user_id', request.qs().user)
                    })
                    .firstOrFail()
                    .then( async post => {
                        return await User.findOrFail(request.qs().user)
                            .then( async user => {

                                if (!post.$extras.reports_count) {

                                    return await post.related('reports').attach({
                                        [user.id]: {
                                            comment: valid_report.comment,
                                            report_type: valid_report.report_type,
                                        }
                                    })
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
                                                model: 'reports_attach'
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

                            .catch( () => {
                                return {
                                    success: false,
                                    result: 'user_not_fount',
                                }
                            })
                    })

                    .catch( () => {
                        return {
                            success: false,
                            result: 'post_not_fount',
                        }
                    })

            })
            .catch( (e: ValidationException) => {
                return e.messages
            })
    }

}
