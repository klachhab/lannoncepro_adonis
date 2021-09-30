import Factory from '@ioc:Adonis/Lucid/Factory'
import User from "App/Models/User";
import { string } from '@ioc:Adonis/Core/Helpers'
import Post from "App/Models/Post/Post";
import PostGallery from "App/Models/Post/PostGallery";

export const GalleryFactory = Factory
    .define(PostGallery, ({faker}) => {
        return {
            path: faker.random.image()
        }
    })
    .build()


export const PostFactory = Factory
    .define(Post, ({faker}) => {
        return {
            category_id: faker.datatype.number({min:13, max:105}),
            city_id: faker.datatype.number({min: 1, max: 1000}),
            delivery_mode_id: faker.datatype.number({min: 1, max: 10}),

            user_id: faker.datatype.number({min: 1, max: 20}),

            title: faker.random.words(Math.floor(Math.random() * 5) + 2),
            description: faker.lorem.paragraph(),
            condition: faker.random.arrayElement(['new', 'used']),
            price: faker.datatype.float(2),
            negotiable: faker.datatype.boolean(),
            lat: faker.datatype.float(2),
            lon: faker.datatype.float(2),
            is_valid: faker.datatype.boolean(),
            featured: faker.datatype.boolean(),

        }
    })
    .relation('images', () => GalleryFactory)
    .build()

export const UserFactory = Factory
    .define(User, ({ faker }) => {
        return {
            title: faker.random.arrayElement(['miss', 'mrs', 'mr']),
            name: `${faker.name.firstName()} ${faker.name.lastName()}` ,
            username: string.dotCase(faker.internet.userName()),
            email: faker.internet.email(),
            password: 'password',
            phone: faker.datatype.number({min: 11111111, max: 99999999}),
            picture: faker.random.image(),
            city_id: faker.datatype.number({min: 1, max: 1000}),
        }
    })
    .relation('posts', () => PostFactory)
    .build()
