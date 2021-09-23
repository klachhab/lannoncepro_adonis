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
		user_id: schema.string({}, [
			rules.exists({table: 'users', column: 'id'})
		]),

		post: schema.string({}, [
			rules.exists({table: 'posts', column: 'id'})
		]),

		report_type: schema.string({}, [
			rules.exists({table: 'report_types', column: 'id'})
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
		'user_id.required' : "Vous devez être connecté pour pouvoir ajouter publier une annonce",
		'user_id.exists' : "Nom d'utilisateur incorrecte",

		'post.required' : "Assuez-vous que vous évaluer la bonne annonce",
		'post.exists' : "Assuez-vous que vous évaluer la bonne annonce",

		'report_type.required' : "Veuillez selectionner le type de rapport",
		'report_type.exists' : "Vous devez selectionner le bon type de rapport",

		'comment.required': "Merci d'ajouter un commentaire a votre rapport",
		'comment.minLength': "Votre commentaire doit contenir au moins {{ options.minLength }} caractères afin de bien détailler votre rapport"
	}
}
