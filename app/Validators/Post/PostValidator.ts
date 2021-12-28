import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostValidator {

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    public schema = schema.create( {

        // Relations ================================================
        // user_id: schema.string({}, [
        //   rules.exists({table: 'users', column: 'id'})
        // ]),

        city_id: schema.number( [
          rules.exists({table: 'cities', column: 'id'})
        ]),

        category_id: schema.string( {}, [
            rules.exists( { table: 'categories', column: 'id' } )
        ] ),

        delivery_mode_id: schema.string(
            {}, [
            rules.exists( { table: 'delivery_modes', column: 'id' } )
        ] ),
        // ! Relations ================================================
        reason: schema.enum( ['sell', 'buy'] ),

        // title: schema.string( {}, [
        //     rules.unique( { table: 'posts', column: 'title' } ),
        // ] ),

        title: schema.string(),

        description: schema.string( {} ),

        condition: schema.enum( [ 'new', 'used' ] ),

        price: schema.number.optional( [
            rules.unsigned(),
        ] ),

        negotiable: schema.boolean()
    } )

    public messages = {
        'title.required': "Le titre de l'annonce est obligatoire",
        'title.unique': "Ce titre est déjà utiliser dans une autre annonce",

        'description.required': "La description de l'annonce est obligatoire",

        'condition.enum': "La condition n'est pas valide",
        'condition.required': "Merci de choisir la condition du produit que vous souhaitez vendre",

        'reason.enum': "La condition n'est pas valide",
        'reason.required': "Merci de choisir la condition du produit que vous souhaitez vendre",

        'price.unsigned': "Le prix de vente ne doit pas être négatif",

        'negotiable.required': "Merci d'indiquer si le prix de vente est négociable ou non",


        'city_id.required': "Merci d'indiquer votre ville",
        'city_id.exists': "Cette ville/commune n'existe pas dans nos bases de données et/ou incorrecte<sup>*</sup>",

        'category_id.required': "Merci de selectionner une catégorie",
        'category_id.exists': "La catégorie que vous avez selectionné n'est pas correcte",

        'delivery_mode_id.required': "Merci d'indiquer le mode de livraison",
        'delivery_mode_id.exists': "Le mode de livraison que vous avez indiquer n'est pas correcte",


    }

    constructor( protected ctx: HttpContextContract ) {
    }
}
