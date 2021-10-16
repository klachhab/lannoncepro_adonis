import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Department from "App/Models/Department";

export default class DepartmentsController {
    public async index({}: HttpContextContract) {

        return Department.query()
            .has('cities')
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
