import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReportValidator {
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

		// Relations ================================================
		user: schema.string({}, [
			rules.exists({table: 'users', column: 'id'})
		]),

		report_type: schema.string({}, [
			rules.exists({table: 'report_types', column: 'ref'})
		]),


		comment: schema.string({},[
			rules.minLength(200)
		]),

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
		'user.required': "Vous devez être connecté pour pouvoir ajouter un avis",
		'user.exists': "Utilisateur inconnu",

		'report_type.required' : "Veuillez selectionner le type de rapport",
		'report_type.exists' : "Vous devez selectionner le bon type de rapport",

		'comment.required': "Merci d'ajouter un commentaire dans votre rapport",
		'comment.minLength': "Votre commentaire doit contenir au moins {{ options.minLength }} caractères afin de bien détailler votre rapport"
	}
}
