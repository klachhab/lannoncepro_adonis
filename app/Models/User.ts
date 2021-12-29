import {DateTime} from 'luxon'
import {
    afterDelete,
    BaseModel,
    beforeCreate,
    BelongsTo,
    belongsTo,
    column, computed,
    HasMany,
    hasMany, HasManyThrough, hasManyThrough, ManyToMany, manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import City from "App/Models/City";
import Post from "App/Models/Post/Post";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import Encryption from "@ioc:Adonis/Core/Encryption";
import Conversation from "App/Models/Conversation";

export default class User extends compose(BaseModel, SoftDeletes) {

    public serializeExtras = true

    @column({isPrimary: true})
    public id: number

    @column()
    public title: string

    @column()
    public name: string

    @column()
    public username: string

    @column()
    public email: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public avatar: string

    @column({ serializeAs: null })
    public email_verified: boolean

    @column({ serializeAs: null })
    public verification_code: string | null

    @column()
    public user_type: string

    @column()
    public phone: number

    @column()
    public is_online: boolean

    @column()
    public is_pro: boolean

    @column()
    public can_receive_news: boolean

    @column()
    public allow_reviews: boolean

    @column()
    public blocked: boolean

    @column()
    public cityId: number


    @column.dateTime({autoCreate: true, serializeAs: null})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true, serializeAs: null})
    public updatedAt: DateTime

    @column.dateTime({serializeAs: null})
    public deletedAt: DateTime


    // Accessors ===================================================
    @computed()
    public get membre_depuis(){
        return this.createdAt ? this.createdAt
            .toFormat("dd LLL yyyy", {locale: 'fr'})
            : null
    }

// Relationships -------------------------------------
    @belongsTo(() => City)
    public city: BelongsTo<typeof City>

    @hasMany(() => Post)
    public posts: HasMany<typeof Post>

    @manyToMany(() => Post, {
        pivotTable: "favourites"
    })
    public favourites: ManyToMany<typeof Post>

    @manyToMany(() => Post, {
        pivotColumns: ['comment', 'rating'],
        pivotTable: "post_reviews",
        pivotTimestamps: {
            createdAt: true,
            updatedAt: false
        },
    })
    public reviews: ManyToMany<typeof Post>

    @manyToMany(() => Post, {
        pivotColumns: ['comment'],
        pivotTable: "post_reports",
        pivotTimestamps: {
            createdAt: true,
            updatedAt: false
        },
    })
    public reports: ManyToMany<typeof Post>

    @hasManyThrough([
        () => Conversation,
        () => Post
    ])
    public conversations: HasManyThrough<typeof Conversation>

// Hooks -------------------------------------

    @beforeCreate()
    public static async beforeCreate(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password);
        }
        user.verification_code = Encryption.encrypt(user.email)
    }

    @afterDelete()
    public static async deleteRelated(user: User) {
        const posts = await user.related('posts').query()

        for ( let postsKey in posts ) {
            var post = posts[postsKey]

            await post.delete()
                .catch( err => {
                    return {
                        success: false,
                        result: err.message
                    }
                } )
        }
    }


}
