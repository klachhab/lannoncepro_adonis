import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from "App/Models/City";

export default class CitiesController {
  public index ({}: HttpContextContract) {
    return City.query()
        .withCount('posts', posts => {
          posts.where('is_valid', 1)
        })
        .pojo()
        .orderBy('posts_count', 'desc')
        .limit(14)
        .select('name', 'code');
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
