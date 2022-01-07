import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
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
        title: schema.enum(['miss', 'mrs', 'mr']),

        name: schema.string({}, [
            rules.alpha({
                allow: ['space']
            }),
        ]),

        username: schema.string({}, [
            rules.unique({
                table: 'users',
                column: 'username',
                where: {
                    'deleted_at': null
                }
            }),
            rules.regex(/^[a-zA-Z]+?[0-9]/)
        ]),

        email: schema.string({}, [
            rules.email(),
            rules.unique( {
                table: 'users',
                column: 'email',
                where: {
                    'deleted_at': null
                }
            } ),
        ]),

        phone: schema.string({}, [
            rules.regex(/^[0-9]+$/),
            rules.minLength(10),
            rules.maxLength(10),
            // rules.mobile({
            //     strict: true,
            //     locales: ['fr-FR']}
            // ),
            rules.unique({
                table: 'users',
                column: 'phone',
                where: {
                    ['deleted_at']: null
                }}),
        ]),

        password: schema.string({}, [
            rules.minLength(8),
            rules.confirmed(),
        ]),

        city_id: schema.number( [
            rules.exists({table: 'cities', column: 'id'})
        ]),

        // city_code: schema.number( [
        //     rules.exists({table: 'cities', column: 'code'})
        // ]),

        // department_code: schema.string({}, [
        //     rules.exists({table: 'departments', column: 'code'})
        // ]),

        // avatar: schema.file({
        // 	size: '2mb',
        // 	extnames: ['jpg', 'gif', 'png'],
        // }),
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
        'title.required': "Merci de choisir votre titre de civilité",
        'title.enum': "Le titre de civilité n'est pas valide",

        'name.required': "Merci de saisir votre nom complet",
        'name.alpha': "Le nom ne doit contenir ni chiffres ni caractères speciaux",

        'username.required': "Merci de choisir un nom d'utilisateur",
        'username.unique': "Le nom d'utilisateur est déjà existant. Merci d'en choisir un autre",
        'username.regex': "Le nom d'utilisateur doit contenir seulement des chiffres et lettres commençant par une lettre",

        'email.required': "L'adresse e-email est obligatoire",
        'email.email': "L'adresse e-email n'est pas valide",
        'email.unique': "L'adresse e-email est déjà utilisé",

        'password.required': "Merci de choisir un mot de passe",
        'password.minLength': "Le mot de passe doit contenir au minimum {{ options.minLength }} caractères",
        'password_confirmation.confirmed': "Les mots de passe que vous avez saisi ne sont pas identiques",

        'phone.required': "Votre numéro de téléphone est obligatoir",
        // 'phone.regex': "Le numéro de téléphone que vous avez saisi n'est pas valide",
        'phone.unique': "Le numéro de téléphone est déjà utilisé",
        'phone.minLength': "Le numéro de téléphone que vous avez saisi n'est pas valide",
        'phone.maxLength': "Le numéro de téléphone que vous avez saisi n'est pas valide",


        'city_id.required': "Merci d'indiquer votre ville",
        'city_id.exists': "Cette ville/commune n'existe pas ou le nom n'est pas correcte",

        // 'city_code.required': "Merci d'indiquer votre ville",
        // 'city_code.exists': "Cette ville/commune n'existe pas",
        //
        // 'department_code.required': "Merci d'indiquer votre ville",
        // 'department_code.exists': "Cette ville/commune n'existe pas",


        // "avatar.size": "La taille de l'image ne doit pas dépasser {{ options.size}}",
        // "avatar.extnames": "L'image doit être sous format JPG, JPEG ou PNG",
    }
}
