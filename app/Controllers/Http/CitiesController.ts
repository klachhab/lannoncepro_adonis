import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import City from "App/Models/City";
import Department from "App/Models/Department";

export default class CitiesController {

    public index({params, request}: HttpContextContract) {

        return Department.query()
            .where('code', params.dep_code)
            .select('id')
            .preload('cities', cities => {
                cities.select('name', 'departmentId')
            })
            .firstOrFail()
            .then(async department => {

                return await department
                    .related('cities')
                    .query()
                    .where('name', "like", `${ request.all().name }%`)

            })

            .catch(err => {
                return {
                    error: err.message,
                    target: "dep"
                }
            })
    }

    public async create({}: HttpContextContract) {
    }

    public async store({}: HttpContextContract) {
    }


    public async show({params}: HttpContextContract) {
        return await City.query()
            .where('code', params.code)
            .select()
            .firstOrFail()

            .then(() => {
                return {
                    success: true,
                }
            })
            .catch((err) => {
                return {
                    success: false,
                    error: err.code
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
