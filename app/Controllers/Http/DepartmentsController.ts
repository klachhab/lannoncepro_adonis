import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Department from "App/Models/Department";

export default class DepartmentsController {
    public async index({}: HttpContextContract) {
        const departments = await Department.query()
            .withCount('cities', builder => {
                builder.as("total_cities")
            })
            .preload('cities', (cities) => {
                cities
                    .withCount('posts', posts => {
                        posts.where('is_valid', 1)
                    })
                    // .pojo()
                    .orderBy('posts_count', 'desc')
                    // .limit(14)
                    .select('name', 'code');
            })
        return {
            departments
        }
    }

    public async create({}: HttpContextContract) {
    }

    public async store({request}: HttpContextContract) {
        return await Department.create(request.all())
            .then( department => {
                return {
                    department
                }
            })
    }

    public async show({params}: HttpContextContract) {

        return await Department.query()
            .preload('cities', cities => {
                cities.select('id', 'name', 'code')
                    // .limit(14)
            })
            .where('code', params.id)
            .select()
            .firstOrFail()
            .then(department => {
                return {
                    success: true,
                    cities: department.cities,
                }
            })
            .catch(e => {
                return {
                    success: false,
                    error: e.code
                }
            })
    }

    public async edit({}: HttpContextContract) {
    }

    public async update({}: HttpContextContract) {
    }

    public async destroy({}: HttpContextContract) {
    }
}
