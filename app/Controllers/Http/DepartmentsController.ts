import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from "App/Models/Department";

export default class DepartmentsController {
  public async index ({}: HttpContextContract) {
    const departments = await Department.query()
        .withCount('cities', builder => {
          builder.as("total_cities")
        })
        .preload('cities', (query) => {
          query.groupLimit(5)
        })



    return {
      departments
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({params}: HttpContextContract) {

    const department = await Department.query()
        .preload('cities')
        .where('id', params.id)
        .firstOrFail()

    return { department }

  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
