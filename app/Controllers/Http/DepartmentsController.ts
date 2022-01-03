import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Department from "App/Models/Department";

export default class DepartmentsController {
    public async index({request}: HttpContextContract) {

        return Department.query()
            .has('cities')
            .where('name', "like", `${ request.all().name }%`)
            .select('name', 'code');

    }

    public async search({params}: HttpContextContract) {
        return Department.query()
            .has('cities')
            .where('name', "like", `${ params.query }%`)
            .orWhere('code', params.query)
            .select('name', 'code')
            .firstOrFail()
            .then( dep => {
                return {
                    success: true,
                    response: dep
                }
            })
            .catch( (err) => {
                return {
                    success: false,
                    response: err
                }
            });
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


    public async home_cities({ params }: HttpContextContract) {

        return await Department.query()
            .preload( 'cities', cities => {
                cities.withCount( 'posts', posts => {
                    posts.where( 'is_valid', 1 )
                        .whereNull( 'deleted_at' )
                } )
                // .limit(14)
            } )

            .where( 'code', params.query )
            .orWhere( 'name', "like", `${params.query}%` )
            // .firstOrFail()
            .then( async departments => {
                // const cities = departments
                //     .map(department => department.cities)

                return {
                    success: true,
                    departments,
                    // cities,
                    // department_posts_count: cities
                    //     .map(city => city.$extras.posts_count)
                    //     .reduce( (a,b) => a + b, 0),

                    // cities: cities
                    //     .sort((a,b) => {
                    //         return b.$extras.posts_count - a.$extras.posts_count
                    //     })
                    //     .slice(0, 14)
                }

            } )
            .catch( e => {
                return {
                    success: false,
                    error: e.message
                }
            } )

    }



    public async edit({}: HttpContextContract) {
    }

    public async update({}: HttpContextContract) {
    }

    public async destroy({}: HttpContextContract) {
    }
}
