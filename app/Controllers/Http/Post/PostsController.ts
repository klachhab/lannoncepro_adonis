import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from "App/Models/Post/Post";
import PostPic from "App/Models/Post/PostPic";
import PostValidator from "App/Validators/Post/PostValidator";
import { Exception } from "@poppinss/utils";
import { ValidationException } from "@adonisjs/validator/build/src/ValidationException";
import User from "App/Models/User";
import Category from "App/Models/Category";
import DeliveryMode from "App/Models/Post/DeliveryMode";
import Department from "App/Models/Department";
import { AuthenticationException } from "@adonisjs/auth/build/standalone";
import { DateTime } from "luxon";
import ReportType from "App/Models/Post/ReportType";
import Conversation from "App/Models/Conversation";
import IsAdminOwnerException from "App/Exceptions/IsAdminOwnerException";
import City from "App/Models/City";
import Application from "@ioc:Adonis/Core/Application";
import ReportValidator from "App/Validators/Post/ReportValidator";

export default class PostsController {

    protected ids: number[]

    public index({ request }: HttpContextContract) {
        return Post.filter( request.qs() )
            .paginate( request.qs().page, 20 )

    }

    public async create({ view, auth }: HttpContextContract) {
        // return await Category.query().doesntHave('parent').select('name', 'slug','id')
        const authenticated = await auth.check().then( verified => {
            return verified
        } )

        if ( authenticated ) {
            const user = auth.user as User

            if ( user.email_verified ) {
                return view.render( "posts/create", {
                    categories: await Category.query()
                        .has( 'subs' )
                        .select( 'name', 'slug', 'id' )
                } )
            } else {
                return view.render( "errors/unauthorized" )
            }
        } else {
            return view.render( "errors/unauthentified" )
        }

    }

    public async details({ request, view, auth }: HttpContextContract) {
        // return request.all()
        const authenticated = await auth.check().then( verified => {
            return verified
        } )

        if ( !authenticated ) {
            return view.render( "errors/unauthentified" )
        } else {
            const user = auth.user as User
            if ( !user.email_verified ) {
                return view.render( "errors/unauthorized" )
            }
        }

        const category = await Category.query()
            .where( 'slug', request.all().sub_category )
            // .has('parent')
            .preload( 'parent', parent => {
                parent.select( 'name' )
            } )
            .select( 'id', 'name', 'category_id' )
            .firstOrFail()
            .then( category => {
                return category
            } )
            .catch( err => {
                return {
                    error: err.code
                }
            } )

        const delivery_modes = await DeliveryMode.query()
            .select( 'id', 'mode' )

        // return {
        //     category,
        //     delivery_modes
        // }

        return view.render( 'posts/create_details', {
            category,
            delivery_modes,
        } ).catch( err => {
            return {
                err
            }
        } )
    }



    public async store({ request, auth }: HttpContextContract) {
        return await auth.check()
            .then( async authenticated => {
                if ( !authenticated ) {
                    return {
                        success: false,
                        message: 'not_auth',
                    }
                }

                // -----------------------------------------
                const user = auth.user as User
                await user.load( 'city', city => {
                    city.preload( 'department' )
                } )

                const city_code = JSON.parse( request.all().same_city ) ? user.city.code : request.all().city_code
                const department_code = JSON.parse( request.all().same_city ) ? user.city.department.code : request.all().department_code

                const get_city = await Department
                    .query()
                    .where( 'code', department_code )
                    .firstOrFail()
                    .then( async dep => {

                        return await dep.related( 'cities' )
                            .firstOrCreate(
                                { code: city_code },
                                {
                                    code: request.all().city_code,
                                    name: request.all().city_name,
                                    longitude: request.all().longitude,
                                    latitude: request.all().latitude
                                }
                            )
                            .then( async city => {
                                await city.load( 'department' )
                                return {
                                    success: true,
                                    response: city,
                                } as {
                                    success: boolean,
                                    response: City,
                                }
                            } )
                            .catch( err => {
                                return {
                                    success: false,
                                    model: 'new_city',
                                    response: err.message,
                                } as {
                                    success: boolean,
                                    model: string,
                                    response: string,
                                }
                            } )

                    } )
                    .catch( err => {
                        return {
                            success: false,
                            model: 'dep',
                            response: err.message,
                        } as {
                            success: boolean,
                            model: string,
                            response: string,
                        }
                    } )


                if ( !get_city.success ) {
                    return get_city
                } else {
                    const ct = get_city.response as City
                    request.all().city_id = ct.id
                }


                return await request.validate( PostValidator )
                    .then( async (data: Object) => {
                        // return data
                        return await user.related( 'posts' )
                            .create( data )
                            .then( async post => {

                                const pics = request.files( 'photos' )
                                const public_path = Application.publicPath( '/uploads' )

                                if ( request.all().video_type ) {

                                    if ( request.all().video_type == 'iframe' && typeof request.all().video_link == 'string' ) {
                                        post.videoLink = request.all().video_link
                                        post.save()
                                            .catch( err => {
                                                return {
                                                    success: false,
                                                    message: err.message,
                                                }
                                            } )
                                    } else {
                                        const video = request.file( 'video_link' )

                                        if ( request.all().video_type == 'local' && video ) {
                                            await video.move( `${public_path}/${post.id}-${post.slug}`, {
                                                name: `video.${video.extname}`
                                            } )
                                                .then( () => {
                                                    post.videoLink = `/uploads/${post.id}-${post.slug}/${video.clientName}`
                                                    post.save()
                                                        .catch( err => {
                                                            return {
                                                                success: false,
                                                                message: err.message,
                                                            }
                                                        } )
                                                } )
                                                .catch( err => {
                                                    return {
                                                        success: false,
                                                        message: err.message,
                                                    }
                                                } )
                                        }

                                    }
                                }

                                if ( pics.length ) {
                                    for ( let pic of pics ) {
                                        var file_path = `${public_path}/${post.id}-${post.slug}/pics`
                                        await pic.move( `${file_path}`, {
                                            name: pic.clientName
                                        } )
                                            .then( async () => {
                                                await post.related( 'pictures' )
                                                    .create( {
                                                        path: `/uploads/${post.id}-${post.slug}/pics/${pic.clientName}`
                                                    } )
                                                    .catch( err => {
                                                        return {
                                                            success: false,
                                                            message: err.message,
                                                        }
                                                    } )
                                            } )
                                            .catch( err => {
                                                return {
                                                    success: false,
                                                    message: err.message,
                                                }
                                            } )
                                    }
                                }

                                await post.load( 'user' )
                                await post.load( 'city' )

                                return {
                                    success: true,
                                    message: post,
                                }

                            } )
                            .catch( err => {
                                return {
                                    success: false,
                                    message: err.message,
                                }
                            } )

                    } )
                    .catch( (err: ValidationException) => {
                        return {
                            success: false,
                            message: err.messages.errors,
                        }
                    } )

            } )
            .catch( () => {
                return {
                    success: true,
                    response: "not_auth",
                }
            } )

    }


    public async show({ request, params, view, auth }: HttpContextContract) {
        return await Post.query()
            .where( 'slug', params.id )
            .andWhere( 'is_valid', 1 )

            .preload( 'deliveryMode', delivery => {
                delivery.select( 'mode' )
            } )
            .preload( 'pictures', image => {
                image.select( 'path' )
            } )
            .preload( 'reviews', reviews => {
                reviews.select( 'name', 'avatar', 'created_at' )
            } )
            .preload( 'user', user => {
                user.select( 'title', 'name', 'phone', 'is_pro', 'username', 'created_at' )
            } )
            .preload( 'city' )
            .preload( 'favourites', favourites => {
                favourites.select( 'created_at' )
            } )
            .preload( 'reports', reports => {
                reports.select()
            } )
            .preload( 'category', category => {
                category.select( 'name' )
            } )
            .firstOrFail()

            .then( async post => {

                if ( request.qs().pictures ) {
                    return post.pictures
                }

                const authenticated = await auth.check()
                    .then( async checked => {
                        return checked;
                    } )
                    .catch( (err: AuthenticationException) => {
                        return {
                            error: err.message
                        }
                    } )

                const user = auth.user as User

                const favourites = post.favourites.map( fav => fav.id )
                const reviews = post.reviews.map( rev => rev.id )
                const reports = post.reports.map( rep => rep.id )

                const fav_revs = {
                    isMyFavourite: authenticated && favourites.includes( user.id ),
                    iHaveRevs: authenticated && reviews.includes( user.id ),
                    iHaveReps: authenticated && reports.includes( user.id ),
                    reviews_avg: post.reviews_avg,
                }

                const report_types = await ReportType.query()

                if ( auth.defaultGuard == "api" ) {
                    return {
                        report_types,
                        post,
                        user: authenticated ? user.id : "unauthenticated",
                        fav_revs
                    }
                }

                // return {
                //     report_types,
                //     post,
                //     user_name: authenticated ? user.name : null,
                //     fav_revs
                // }

                return view.render( 'posts/show', {
                    report_types,
                    post,
                    user_name: authenticated ? user.name : null,
                    user_email: authenticated ? user.email : null,
                    fav_revs
                } )

            } )

            .catch( async () => {
                // return {
                //     success: false,
                //     error: e.message,
                // }
                return await view.render( 'errors.not-found' )
            } )
    }


    public async edit({ params, view }: HttpContextContract) {
        try {
            const post = await Post.query().where( 'slug', params.id ).firstOrFail()
            return { post }
        } catch ( ex ) {
            return await view.render( 'errors.not-found' )
        }
    }


    public async update({ request, params }: HttpContextContract) {
        return await Post.query()
            .where( 'slug', params.id )
            .firstOrFail()
            .then( async post => {
                return await request.validate( PostValidator )
                    .then( async (resp: Object) => {

                        return await post.merge( resp )
                            .save()
                            .then( post => {
                                return {
                                    success: true,
                                    post
                                }
                            } )
                            .catch( (err: Exception) => {
                                return {
                                    success: false,
                                    error: err.code,
                                }
                            } )

                    } )
                    .catch( (err: ValidationException) => {
                        return {
                            success: false,
                            error: err.messages,
                        }
                    } )

            } )
            .catch( (err: Exception) => {
                return {
                    success: false,
                    message: err.code,
                }
            } )
    }


    public async destroy({ params }: HttpContextContract) {
        return await Post.query()
            .where( 'slug', params.id )
            .firstOrFail()
            .then( async post => {
                return await post.delete()
                    .then( async () => {
                        // await post.related('favourites').detach()
                        // await post.related('reports').detach()
                        // await post.related('reviews').detach()

                        await PostPic.query().where( 'post_id', post.id )
                            .then( (images) => {
                                images.forEach( (image) => {
                                    image.delete()
                                } )
                            } )

                        return {
                            success: true,
                            result: post
                        }
                    } )
                    .catch( (e: IsAdminOwnerException) => {
                        return {
                            success: false,
                            result: e.message
                        }
                    } )


            } )
            .catch( (err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            } )

    }


    public async restore({ params }: HttpContextContract) {
        return await Post.onlyTrashed()
            .where( 'slug', params.slug )
            .firstOrFail()
            .then( async post => {
                return await post.restore()
                    .then( async () => {
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

                        await PostPic.onlyTrashed().where( 'post_id', post.id )
                            .then( (images) => {
                                images.forEach( (image) => {
                                    image.restore()
                                    post.preload( 'pictures' )
                                } )
                            } )

                        return {
                            success: true,
                            result: post
                        }
                    } )
                    .catch( (e: Exception) => {
                        return {
                            success: false,
                            result: e.code
                        }
                    } )
            } )
            .catch( (err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            } )
    }


    public async forceDelete({ params }: HttpContextContract) {
        return await Post.onlyTrashed()
            .where( 'slug', params.slug )
            .firstOrFail()
            .then( async post => {
                return await post.forceDelete()
                    .then( async () => {
                        return {
                            success: true,
                            result: "forceDeleted"
                        }
                    } )
                    .catch( e => {
                        return {
                            success: false,
                            result: e.code
                        }
                    } )


            } )
            .catch( (err: Exception) => {
                return {
                    success: false,
                    result: err.code
                }
            } )
    }


    public async addToFavourite({ params, auth }: HttpContextContract) {
        return await Post.query()
            .where( 'slug', params.slug )
            .preload( 'favourites', favourites => {
                favourites.select( 'id', 'created_at' )
            } )
            // .select(['id'])
            .firstOrFail()
            .then( async post => {

                return await auth.check()
                    .then( async checked => {

                        const user = auth.user as User
                        const favourites = post.favourites.map( fav => fav.id )

                        const isMyFavourite = checked && favourites.includes( user.id )

                        if ( !user.email_verified ) {
                            return {
                                success: false,
                                result: "not_verified",
                            }
                        }

                        else if ( isMyFavourite ) {

                            return post.related( 'favourites' )
                                .detach( [ user.id ] )
                                .then( async () => {
                                    return {
                                        success: true,
                                        result: false
                                    }
                                } )
                                .catch( err => {
                                    return {
                                        success: false,
                                        result: err.code,
                                    }
                                } )
                        } else {
                            return post.related( 'favourites' )
                                .attach( [ user.id ] )
                                .then( async () => {
                                    return {
                                        success: true,
                                        result: true
                                    }
                                } )
                                .catch( err => {
                                    return {
                                        success: false,
                                        result: err.code,
                                    }
                                } )
                        }

                    } )

                    .catch( (err: AuthenticationException) => {
                        console.log( err.message )
                        return false
                    } ) as Boolean

            } )
            .catch( () => {
                return {
                    success: false,
                    result: 'post_not_fount',
                }
            } )

    }



    public async getAddReview({ params, request, auth }: HttpContextContract) {

        if ( request.method() == "GET" ) {

            return await Post.query()
                .where( 'slug', params.slug )
                .andWhere( 'is_valid', 1 )
                .preload( 'reviews', review => {
                    review.select( 'id', 'name', 'avatar', 'created_at' )
                } )
                .firstOrFail()
                .then( post => {
                    const sorted = post.reviews
                        .sort( (a, b) => {
                            return b.$extras.pivot_created_at - a.$extras.pivot_created_at
                        } )
                    const reviews = [] as Array<object>

                    for ( let i = 0; i < sorted.length; i++ ) {
                        var review = sorted[i]
                        const review_created_at = review.$extras.pivot_created_at
                            .toFormat( "ccc dd LLL yyyy 'à' HH:mm", { locale: 'fr' } )

                        reviews.push( {
                            user: {
                                id: review.id,
                                name: review.name,
                                avatar: review.avatar,
                            },
                            comment: review.$extras.pivot_comment,
                            rating: review.$extras.pivot_rating,
                            created_at: review_created_at
                        } )
                    }

                    return {
                        success: true,
                        reviews_avg: post.reviews_avg,
                        reviews: reviews,
                        // sorted
                    }
                } )
                .catch( err => {
                    return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "GetReviews",
                        error: err.message
                    }
                } )

        } else if ( request.method() == "POST" ) {
            return await auth.check()
                .then( async authenticated => {

                    if ( authenticated ) {
                        const user = auth.user as User

                        return await Post.query()
                            .where( 'slug', params.slug )
                            .andWhere( 'is_valid', 1 )
                            .preload( 'reviews', review => {
                                review.select( 'id' )
                            } )
                            .firstOrFail()
                            .then( post => {
                                return user.related( 'reviews' )
                                    .attach( {
                                        [post.id]: request.all()
                                    } )
                                    .then( () => {
                                        const date = DateTime.now().toFormat( "dd/LL/yyyy 'à' HH:mm" )
                                        const reviews_ratings = post.reviews.map( revs => revs.$extras.pivot_rating );
                                        reviews_ratings.push( Number.parseInt( request.all().rating ) )

                                        const reviews_length = reviews_ratings.length;


                                        return {
                                            success: true,
                                            review: {
                                                user: {
                                                    id: user.id,
                                                    name: user.name,
                                                    avatar: user.avatar,
                                                },
                                                comment: request.all().comment,
                                                rating: Number.parseInt( request.all().rating ),
                                                created_at: date,
                                            },
                                            reviews_avg: reviews_ratings.reduce( (a, b) => a + b ) / reviews_length,
                                        }
                                    } )

                                    .catch( err => {
                                        return {
                                            success: false,
                                            controller: "Post/PostsController",
                                            method: "attachReview",
                                            error: err.message
                                        }
                                    } )

                            } )
                            .catch( err => {
                                return {
                                    success: false,
                                    controller: "Post/PostsController",
                                    method: "addReview_PostNotFount",
                                    error: err.message
                                }
                            } )
                    } else return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "addReview",
                        error: "not_authenticated"
                    }

                } )
                .catch( (err: AuthenticationException) => {
                    return {
                        success: false,
                        controller: "Post/PostsController",
                        method: "addReview",
                        error: err.message
                    }
                } )
        }

        else return

    }


    public async addReport({ auth, params, request }: HttpContextContract) {

        await auth.check()
            .then( checked => {
                if ( checked ) {
                    const user = auth.user as User

                    request.all().user_id = user.id
                    request.all().name = user.name
                    request.all().email = user.email
                }

            })

        // Get Report =======================
        const report_type = await ReportType.query()
            .where( 'ref', request.all().report_type )
            .select()
            .firstOrFail()
            .then( report_type => {
                delete request.all().report_type

                return {
                    success: true,
                    result: report_type.id
                } as { success: boolean, result: number }
            } )
            .catch( err => {
                return {
                    success: false,
                    result: err.message
                } as { success: boolean, result: string }
            } )

        if ( report_type.success ) {
            request.all().report_type_id = report_type.result
        }

        // Get Post =======================
        const post = await Post.query()
            .where( 'slug', params.slug )
            .select( [ 'id', 'title' ] )
            .firstOrFail()
            .then( post => {
                return {
                    success: true,
                    result: post
                } as { success: boolean, result: Post }
            } )
            .catch( err => {
                return {
                    success: false,
                    result: err.message
                } as { success: boolean, result: string }
            } )

        if ( !post.success ) {
            return {
                success: false,
                result: post.result,
                error: 'post_not_found'
            }
        }

        // else {
        //     return {
        //         success: true,
        //         result: post.result,
        //     }
        // }

        // Validation =======================
        const report_validation = await request.validate(ReportValidator)
            .then( (result: Object) => {
                return {
                    success: true,
                    result
                }
            })
            .catch( (error: ValidationException) => {

                const validation_errors =  error.messages.errors
                const errors = {}

                for ( const messageKey in validation_errors ) {
                    var message = validation_errors[messageKey]
                    errors[message.field]  = message.message
                }

                return {
                    success: false,
                    result: errors
                }
            })

        if ( !report_validation.success ) {
            return {
                success: false,
                result: report_validation.result,
                error: 'validation'
            }
        }

        // Create Report =======================

        const pst = post.result as Post

        return pst.related('reports').create(request.all())
            .then( report => {
                return { success: true, report }
            })
            .catch( err => {
                return {
                    success: false,
                    result: err.message,
                }
            })

    }


    public async sendMessage({ params, request }: HttpContextContract) {
        // return request.all().conversation_key ? "exists" : "doesn't exist"

        return await Post.query()
            .where( 'slug', params.slug )
            .select( 'id', 'user_id' )
            .firstOrFail()
            .then( async post => {
                // return post
                const post_conversation: boolean | Conversation = await post.related( 'conversations' )
                    .query()
                    .where( 'from_email', request.all().from_email )
                    .preload( 'messages' )
                    .firstOrFail()
                    .then( conversation => {
                        return conversation
                    } )
                    .catch( () => {
                        return false
                    } )

                // return post_conversations

                if ( post_conversation instanceof Conversation ) {
                    return await post_conversation.related( 'messages' )
                        .create( {
                            message: request.all().message,
                            direction: request.all().direction,
                        } )
                        .then( async message => {
                            await message.load( 'conversation' )
                            return {
                                success: true,
                                message,
                            }
                        } )
                        .catch( err => {
                            return {
                                success: false,
                                controller: "Post/PostsController",
                                method: "sendMessage_conversation",
                                error: err.message
                            }
                        } )

                } else {
                    return await post.related( 'conversations' )
                        .create( {
                            from_name: request.all().from_name,
                            from_email: request.all().from_email,
                        } )
                        .then( async conversation => {

                            return conversation.related( 'messages' )
                                .create( {
                                    message: request.all().message,
                                } )
                                .then( () => {
                                    return {
                                        success: true,
                                        conversation,
                                    }
                                } )
                                .catch( err => {
                                    return {
                                        success: false,
                                        controller: "Post/PostsController",
                                        method: "sendMessage_conversation",
                                        error: err.message
                                    }
                                } )
                        } )
                        .catch( err => {
                            return {
                                success: false,
                                controller: "Post/PostsController",
                                method: "sendMessage_conversation",
                                error: err.message
                            }
                        } )
                }
            } )
            .catch( (err: Exception) => {
                return {
                    success: false,
                    controller: "Post/PostsController",
                    method: "sendMessage",
                    error: err.message
                }
            } )
    }

}
