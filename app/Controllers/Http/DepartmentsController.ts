import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Department from "App/Models/Department";

export default class DepartmentsController {
    public async index({request}: HttpContextContract) {

        return Department.query()
            .has('cities')
            .where('name', "like", `${ request.all().name }%`)
            .select('name', 'code');

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
            .where('code', params.code)
            .select()
            .firstOrFail()
            .then(async department => {
                // const cities = await department.related('cities')
                //     .query()
                //     .preload('department', dep => {
                //         dep.select('name', 'code')
                //     })
                //     .where('name', "like", `${ request.qs().city_name }%`)

                return {
                    success: true,
                    department,
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
