import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReportValidator {
    public schema = schema.create( {

        // Relations ================================================
        // user_id: schema.number.optional( [
        //     rules.exists( { table: 'users', column: 'id' } )
        // ]),

        // post_id: schema.number( [
        //     rules.exists( { table: 'posts', column: 'id' } )
        // ]),

        report_type_id: schema.number(  [
            rules.exists( { table: 'report_types', column: 'id' } )
        ] ),

        comment: schema.string( {}, [
            rules.minLength( 200 )
        ] ),

        name: schema.string(),

        email: schema.string({}, [
            rules.email()
        ]),

    } )

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

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */

    public messages = {

        // 'post_id.exists': "Annonce introuvable",
        // 'post_id.required': "Annonce introuvable",

        // 'user_id.exists': "Utilisateur inconnu",

        'report_type_id.required': "Veuillez selectionner le type de rapport",
        'report_type_id.exists': "Vous devez selectionner le bon type de rapport",

        'name.required': "Merci de saisir votre nom",

        'email.required': "Merci de saisir votre adresse e-mail",
        'email.email': "L'adresse e-mail n'est pas correct",

        'comment.required': "Merci d'ajouter un commentaire dans votre rapport",
        'comment.minLength': "Votre commentaire doit contenir au moins {{ options.minLength }} caractères afin de bien détailler votre rapport"
    }

    constructor(protected ctx: HttpContextContract) {
    }
}
