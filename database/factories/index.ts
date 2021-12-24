import Factory from '@ioc:Adonis/Lucid/Factory'
import User from "App/Models/User";
import {string} from '@ioc:Adonis/Core/Helpers'
import Post from "App/Models/Post/Post";
import PostGallery from "App/Models/Post/PostGallery";
import {CATEGORY_IDS, CITIES_IDS, DELIVERY_MODE_IDS, USER_IDS} from "./get_ids";

export const GalleryFactory = Factory
        .define( PostGallery, ( {faker} ) => {
            return {
                path: faker.random.image()
            }
        } )
        .build()


export const PostFactory = Factory
        .define( Post, async ( {faker} ) => {
            return {
                category_id: faker.random.arrayElement( await CATEGORY_IDS ),
                user_id: faker.random.arrayElement( await USER_IDS ),
                delivery_mode_id: faker.random.arrayElement( await DELIVERY_MODE_IDS ),
                city_id: faker.random.arrayElement( await CITIES_IDS ),
                
                title: faker.random.words( Math.floor( Math.random() * 5 ) + 2 ),
                reason: faker.random.arrayElement( ['sell', 'buy'] ),
                description: faker.lorem.paragraph(),
                condition: faker.random.arrayElement( ['new', 'used'] ),
                price: faker.datatype.float( 2 ),
                negotiable: faker.datatype.boolean(),
                lat: faker.datatype.float( 2 ),
                lon: faker.datatype.float( 2 ),
                is_valid: faker.datatype.boolean(),
                featured: faker.datatype.boolean(),
                
            }
        } )
        .relation( 'images', () => GalleryFactory )
        .build()

export const UserFactory = Factory
        .define( User, async ( {faker} ) => {
            return {
                title: faker.random.arrayElement( ['miss', 'mrs', 'mr'] ),
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                username: string.dotCase( faker.internet.userName() ),
                email: faker.internet.email(),
                password: 'password',
                phone: faker.datatype.number( {min: 11111111, max: 99999999} ),
                avatar: faker.random.image(),
                city_id: faker.random.arrayElement( await CITIES_IDS ),
            }
        } )
        // .relation('posts', () => PostFactory)
        .build()
