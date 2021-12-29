import {DateTime} from 'luxon'
import {
    BaseModel,
    BelongsTo,
    belongsTo,
    column,
    computed,
    HasMany,
    hasMany,
    ManyToMany,
    manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Category from "App/Models/Category";
import User from "App/Models/User";
import City from "App/Models/City";
import DeliveryMode from "App/Models/Post/DeliveryMode";
import {slugify} from "@ioc:Adonis/Addons/LucidSlugify";
import {compose} from "@poppinss/utils/build/src/Helpers";
import {SoftDeletes} from "@ioc:Adonis/Addons/LucidSoftDeletes";
import {Filterable} from '@ioc:Adonis/Addons/LucidFilter';
import PostFilter from "App/Models/Filters/PostFilter";
import Conversation from "App/Models/Conversation";
import PostPic from "App/Models/Post/PostPic";

export default class Post extends compose(BaseModel, SoftDeletes, Filterable) {

    public serializeExtras = true

    @column({isPrimary: true})
    public id: number

    @column()
    @slugify({
        strategy: 'simple',
        fields: ['title'],
        allowUpdates: true,
        completeWords: true,
    })
    public slug: string

    @column()
    public title: string

    @column()
    public description: string

    @column()
    public condition: string

    @column()
    public reason: string

    @column({serializeAs: null})
    public price: number

    @column()
    public negotiable: boolean

    @column()
    public videoLink: string | null

    @column()
    public videoType: string | null

    @column()
    public isValid: boolean

    @column()
    public featured: boolean

    @column({serializeAs: null})
    public userId: number

    @column({serializeAs: null})
    public categoryId: number

    @column({serializeAs: null})
    public cityId: number

    @column({serializeAs: null})
    public deliveryModeId: number

    @column.dateTime({autoCreate: true, serializeAs: null})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime

    @column.dateTime({serializeAs: null})
    public deletedAt: DateTime

// Relationships -------------------------------------
    @belongsTo(() => Category)
    public category: BelongsTo<typeof Category>

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @belongsTo(() => City)
    public city: BelongsTo<typeof City>

    @belongsTo(() => DeliveryMode)
    public deliveryMode: BelongsTo<typeof DeliveryMode>

    // @computed()
    // public get primary_image(){
    //     return this.images?.length ? this.images[0].path : null
    // }

    @hasMany(() => PostPic)
    public pictures: HasMany<typeof PostPic>

    @hasMany(() => Conversation)
    public conversations: HasMany<typeof Conversation>

    @manyToMany(() => User, {
        pivotTable: "favourites",
        pivotTimestamps: {
            createdAt: true,
            updatedAt: false
        },
    })
    public favourites: ManyToMany<typeof User>

    @manyToMany(() => User, {
        pivotColumns: ['comment', 'rating'],
        pivotTable: "post_reviews",
        pivotTimestamps: {
            createdAt: true,
            updatedAt: false
        },
    })
    public reviews: ManyToMany<typeof User>

    @manyToMany(() => User, {
        pivotColumns: ['comment'],
        pivotTable: "post_reports",
        pivotTimestamps: {
            createdAt: true,
            updatedAt: false
        },
    })
    public reports: ManyToMany<typeof User>

    // -----------------------------------------------

// Accessors ===================================================
    @computed()
    public get creation_date() {
        return this.createdAt ? this.createdAt
                        .toFormat("dd/LL/yyyy 'à' HH:mm", {locale: 'fr'})
                : null
    }

    @computed()
    public get prix() {
        return this.price ? this.price.toLocaleString('fr', {
            minimumFractionDigits: 2,
        }) + ' €' : null
    }

    // -----------------------------------------------

    @computed()
    public get reviews_avg() {
        const revs_rating_avg = this.reviews && this.reviews.length ?
                this.reviews.map(revs => revs.$extras.pivot_rating)
                        .reduce((a, b) => a + b) / this.reviews.length : 0

        return revs_rating_avg
                .toLocaleString('fr', {
                    maximumFractionDigits: 1,
                })
    }

    @computed()
    public get has_unread_message() {
        return this.conversations ? this.conversations
                .map(conversation => conversation.read).includes(Boolean( 0 )) : null
    }

    public static $filter = () => PostFilter

}
