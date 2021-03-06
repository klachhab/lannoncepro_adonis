import {schema, rules} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class ReviewValidator {
    constructor(protected ctx: HttpContextContract) {
    }

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

    public schema = schema.create({
        //
        // post: schema.string({}, [
        //     rules.exists({table: 'posts', column: 'id'})
        // ]),

        comment: schema.string.optional(),

        rating: schema.number([
            rules.unsigned(),
            rules.range(1, 5),
        ])
    })

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
        'rating.required': "La note d'évaluation est obligatoire",
        'rating.unsigned': "La note d'évaluation ne doit pas être négative",
        'rating.range': "La note d'évaluation doit être entre 1 et 5",

        // 'post.exists': "Annonce introuvable",

        // 'post.required': "Assuez-vous que vous évaluer la bonne annonce",
        // 'post.exists': "Assuez-vous que vous évaluer la bonne annonce",
    }
}
