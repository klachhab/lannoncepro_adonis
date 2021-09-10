import Factory from '@ioc:Adonis/Lucid/Factory'
import User from "App/Models/User";
import { string } from '@ioc:Adonis/Core/Helpers'

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
    .build()
