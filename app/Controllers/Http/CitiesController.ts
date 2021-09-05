import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from "App/Models/City";

export default class CitiesController {
  public async index ({}: HttpContextContract) {
    return {
      cities: await City.query().preload('department')
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }


  public async show ({ params }: HttpContextContract) {
    const city = await City.findOrFail(params.id)
    await city.load('department')

    return {
      city
    }
  }


  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
