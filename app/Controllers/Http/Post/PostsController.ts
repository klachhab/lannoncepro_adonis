import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import Application from "@ioc:Adonis/Core/Application";
import PostGallery from "App/Models/Post/PostGallery";
import PostValidator from "App/Validators/Post/PostValidator";
import {Exception} from "@poppinss/utils";
import {ValidationException} from "@adonisjs/validator/build/src/ValidationException";
import User from "App/Models/User";
import ReportValidator from "App/Validators/Post/ReportValidator";
import Category from "App/Models/Category";
import DeliveryMode from "App/Models/Post/DeliveryMode";
import Department from "App/Models/Department";
import {AuthenticationException} from "@adonisjs/auth/build/standalone";
import {DateTime} from "luxon";

export default class PostsController {

    protected ids: number[]

    public async index({request}: HttpContextContract) {
        return await Post.filter(request.qs())
            .paginate(1, 20)
    }

    public async create({view}: HttpContextContract) {
        // return await Category.query().doesntHave('parent').select('name', 'slug','id')

        return view.render("posts/create", {
            categories: await Category.query()
                .doesntHave('parent')
                .select('name', 'slug', 'id')
        })
    }

    public async details({request, view, auth}: HttpContextContract) {

        const category = await Category.query()
            .where('slug', request.all().sub_category)
            .preload('parent', parent => {
                parent.select('name')
            })
            .select('id', 'name', 'category_id')
            .firstOrFail()
            .then(category => {
                return category
            })
            .catch(err => {
                return {
                    error: err.code
                }
            })

        const delivery_modes = await DeliveryMode.query()
            .select('id', 'mode')

        // return {
        //     category: category.id,
        //     delivery_modes
        // }

        return view.render('posts/create_details', {
            category,
            delivery_modes,
            departments: await Department.query().select('code', 'name'),
            user_city: auth.user?.cityId
        })
    }


    public async store({request, auth}: HttpContextContract) {

        return await auth.check()
            .then( async checked => {

                if ( !checked){
                    return {
                        success: false,
                        message: 'not_auth',
                    }
                }

                else {

                    return await request.validate(PostValidator)
                        .then(async (response: Object) => {

                            return await auth.check()
                                .then( async checked => {
                                    if (checked) {
                                        return auth.user?.related('posts')
                                            .create(response)
                                            .then( async post => {

                                                const path = Application.publicPath('uploads/posts/' + post.slug)

                                                // Upload Images =========================================
                                                const images = request.files('images')

                                                if (images.length) {
                                                    images.forEach(image => {
                                                        image.move(path)
                                                            .then(async () => {
                                                                post.related('images').create({
                                                                    path: '/uploads/posts/' + post.slug + "/" + image.clientName
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
                                                // Finished Upload Images =========================================


                                                // Upload Video =========================================

                                                if (request.all().video_type != 'null') {
                                                    post.video_type = request.all().video_type

                                                    if (request.all().video_type === "local") {
                                                        const video = request.file('video_link')
                                                        if (video) {

                                                            await video.move(path)
                                                                .then(() => {
                                                                    post.video_link = '/uploads/posts/' + post.slug + "/" + video.clientName
                                                                })
                                                                .catch(err => {
                                                                    return {
                                                                        success: false,
                                                                        message: `saving_video_error : ${err.code}`,
                                                                    }
                                                                })

                                                        } else {
                                                            return {
                                                                success: false,
                                                                message: `saving_video_error : no_video`,
                                                            }
                                                        }
                                                    } else if (request.all().video_type === "iframe") {

                                                        if (request.all().video_link) {
                                                            post.video_link = request.all().video_link
                                                        } else {
                                                            post.video_type = null
                                                            return {
                                                                success: false,
                                                                message: `Add_video_link`,
                                                            }
                                                        }
                                                    }
                                                }

                                                // Finish uploading Video ===============================

                                                if (request.all().same_city === 'same'){
                                                    // @ts-ignore
                                                    post.cityId = auth.user?.cityId
                                                    post.save()
                                                }

                                                else {
                                                    post.cityId = request.all().city_id
                                                }


                                                return post.save()

                                                    .then( () => {
                                                        return {
                                                            success: true,
                                                            post,
                                                        }
                                                    })
                                                    .catch( err => {
                                                        return {
                                                            success: false,
                                                            message: `saving_city_error : ${ err.code }`,
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
                                    else {
                                        return {
                                            success: false,
                                            message: 'not_auth',
                                        }
                                    }
                                })
                                .catch( (err: AuthenticationException) => {
                                    return {
                                        success: false,
                                        message: err.message,
                                    }
                                })



                        })

                        .catch((err: ValidationException) => {
                            return {
                                success: false,
                                message: err.messages.errors,
                            }
                        })

                }

            })


    }


    public async show({params, response, view, auth}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.id)
            .andWhere('is_valid', 1)

            .preload('deliveryMode', delivery => {
                delivery.select('mode')
            })
            .preload('images', image => {
                image.select('path')
            })
            .preload('reviews', reviews => {
                reviews.select('name', 'avatar', 'created_at')
            })
            .preload('user', user => {
                user.select('title', 'name', 'phone', 'is_pro', 'username', 'created_at')
            })
            .preload('city', city => {
                city.select('name', 'departmentId')
            })
            .preload('favourites')
            .preload('category', category => {
                category.select('name')
            })
            .firstOrFail()
            .then(async post => {

                const authenticated = await auth.check()
                    .then(async checked => {
                        return checked;
                    })
                    .catch( (err: AuthenticationException) => {
                        console.log(err.message)
                        return false
                    })


                const favourites = post.favourites.map(fav => fav.id)
                const reviews = post.reviews.map(rev => rev.id)
                const user = auth.user as User

                const fav_revs = {
                    isMyFavourite: authenticated && favourites.includes(user.id),
                    iHaveRevs: authenticated && reviews.includes(user.id),
                    reviews_avg: post.reviews_avg
                }

                if (auth.defaultGuard == "api") {
                    return {
                        post: post.id,
                        user: authenticated ? user.id : "Unauthenticated",
                        fav_revs
                    }
                }

                return view.render('posts/show', {
                    post,
                    fav_revs
                })

            })
            .catch(async (e: Exception) => {
                return {
                    success: false,
                    error: e.message,
                }
                return await view.render('errors.not-found')
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
                    .catch(e => {
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


    public async addToFavourite({params, auth}: HttpContextContract) {
        return await Post.query()
            .where('slug', params.slug)
            .preload('favourites', favourites => {
                favourites.select('id', 'created_at')
            })
            // .select(['id'])
            .firstOrFail()
            .then(async post => {

                return await auth.check()
                    .then(async checked => {

                        const user = auth.user as User
                        const favourites = post.favourites.map(fav => fav.id)

                        const isMyFavourite = checked && favourites.includes(user.id)


                        if (isMyFavourite){

                            return post.related('favourites')
                                .detach([user.id])
                                .then(() => {
                                    return {
                                        success: true,
                                        result: false
                                    }
                                })
                                .catch(err => {
                                    return {
                                        success: false,
                                        result: err.code,
                                    }
                                })
                        }
                        else {
                            return post.related('favourites')
                                .attach([user.id])
                                .then(() => {
                                    return {
                                        success: true,
                                        result: true
                                    }
                                })
                                .catch(err => {
                                    return {
                                        success: false,
                                        result: err.code,
                                    }
                                })
                        }

                    })

                    .catch( (err: AuthenticationException) => {
                        console.log(err.message)
                        return false
                    }) as Boolean

            })
            .catch(() => {
                return {
                    success: false,
                    result: 'post_not_fount',
                }
            })

    }

    public async getAddReview({params, request, auth}: HttpContextContract) {

        if (request.method() == "GET"){

            return await Post.query()
                .where('slug', params.slug)
                .andWhere('is_valid', 1)
                .preload('reviews', review => {
                    review.select('id', 'name', 'avatar', 'created_at')
                })
                .firstOrFail()
                .then(post => {
                    const sorted = post.reviews
                        .sort( (a,b) => {
                            return b.$extras.pivot_created_at - a.$extras.pivot_created_at
                        })
                    const reviews = []

                    for (let i = 0; i < sorted.length; i++) {
                        var review = sorted[i]
                        const review_created_at = review.$extras.pivot_created_at
                            .toFormat("cccc dd LLL yyyy 'à' HH:mm", {locale: 'fr'})

                        reviews.push({
                            user: {
                                name: review.name,
                                avatar: review.avatar,
                            },
                            comment: review.$extras.pivot_comment,
                            rating: review.$extras.pivot_rating,
                            created_at: review_created_at
                        })
                    }

                    return {
                        success: true,
                        reviews: reviews,
                        // sorted
                    }
                })
                .catch(err => {
                    return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "GetReviews",
                        error: err.message
                    }
                })

        }

        else if (request.method() == "POST") {
            return await auth.check()
                .then(async authenticated => {

                    if (authenticated) {
                        const user = auth.user as User

                        return await Post.query()
                            .where('slug', params.slug)
                            .andWhere('is_valid', 1)
                            .firstOrFail()
                            .then(post => {
                                return user.related('reviews')
                                    .attach({
                                        [post.id]: request.all()
                                    })
                                    .then(() => {
                                        const date = DateTime.now().toFormat("dd/LL/yyyy 'à' HH:mm")

                                        return {
                                            success: true,
                                            review: {
                                                user: {
                                                    name: user.name,
                                                    avatar: user.avatar,
                                                },
                                                comment: request.all().comment,
                                                rating: request.all().rating,
                                                crated_at: date,
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        return {
                                            success: false,
                                            controller: "Post/PostsController",
                                            method: "attachReview",
                                            error: err.message
                                        }
                                    })

                            })
                            .catch(err => {
                                return {
                                    success: false,
                                    controller: "Post/PostsController",
                                    method: "addReview_PostNotFount",
                                    error: err.message
                                }
                            })
                    }
                    else return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "addReview",
                        error: "not_authenticated"
                    }

                })
                .catch((err: AuthenticationException) => {
                    return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "addReview",
                        error: err.message
                    }
                })
        } else {
        }

    }


    public async addReport({params, request}: HttpContextContract) {

        return await request.validate(ReportValidator)

            .then(async valid_report => {

                return await Post.query()
                    .where('slug', params.slug)
                    .select(['id'])
                    .withCount('reports', reports => {
                        reports.wherePivot('user_id', request.qs().user)
                    })
                    .firstOrFail()
                    .then(async post => {
                        return await User.findOrFail(request.qs().user)
                            .then(async user => {

                                if (!post.$extras.reports_count) {

                                    return await post.related('reports').attach({
                                        [user.id]: {
                                            comment: valid_report.comment,
                                            report_type: valid_report.report_type,
                                        }
                                    })
                                        .then(() => {
                                            return {
                                                success: true,
                                                result: 'attached',
                                            }
                                        })

                                        .catch((err: Exception) => {
                                            return {
                                                success: false,
                                                result: err.code,
                                                model: 'reports_attach'
                                            }
                                        })

                                } else {
                                    return {
                                        success: false,
                                        result: 'already_attached'
                                    }
                                }

                            })

                            .catch(() => {
                                return {
                                    success: false,
                                    result: 'user_not_fount',
                                }
                            })
                    })

                    .catch(() => {
                        return {
                            success: false,
                            result: 'post_not_fount',
                        }
                    })

            })
            .catch((e: ValidationException) => {
                return e.messages
            })
    }

}
