import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
	constructor (protected ctx: HttpContextContract) {
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
			rules.unique({ table: 'users', column: 'username' }),
		]),

		email: schema.string({}, [
			rules.email(),
			rules.unique({ table: 'users', column: 'email' }),
		]),

		password: schema.string({}, [
			rules.minLength(8),
			rules.confirmed(),
		]),

		phone: schema.string({}, [
			rules.regex(/^[0-9]+$/),
		]),

		city_id: schema.string({}, [
			rules.required(),
			rules.exists({table: 'cities', column: 'id'})
		]),

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
	  	'title.required' : "Merci de choisir votre titre de civilité",
	  	'title.enum' : "Le titre de civilité n'est pas valide",

		'name.required' : "Merci de saisir votre nom complet",
	  	'name.alpha' : "Le nom ne doit contenir ni les chiffres ni les caractères speciaux",

	  	'username.required' : "Merci de choisir un nom d'utilisateur",
		'username.unique': "Le nom d'utilisateur est déjà existant. Merci d'en choisir un autre",

		'email.required' : "L'adresse e-email est obligatoire",
		'email.email' : "L'adresse e-email n'est pas valide",
		'email.unique' : "L'adresse e-email est déjà utilisé",

		'password.required' : "Merci de choisir un mot de passe",
		'password.minLength' : "Le mot de passe doit contenir au minimum {{ options.minLength }} caractères",
		'password_confirmation.confirmed' : "Les 2 champs du mot de passe ne sont pas identiques",

		'phone.required' : "Votre numéro de téléphone est obligatoir",
		'phone.regex' : "Le numéro de téléphone que vous avez saisi n'est pas valide",

		'city_id.exists' : "Cette ville/commune n'existe pas dans nos bases de données<sup>*</sup>",

		// "avatar.size": "La taille de l'image ne doit pas dépasser {{ options.size}}",
		// "avatar.extnames": "L'image doit être sous format JPG, JPEG ou PNG",
  }
}
