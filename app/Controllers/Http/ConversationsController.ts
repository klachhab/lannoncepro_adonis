import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Conversation from "App/Models/Conversation";

export default class ConversationsController {
    public async index({}: HttpContextContract) {
    }

    public async create({}: HttpContextContract) {
    }

    public async store({}: HttpContextContract) {
    }

    public async show({request}: HttpContextContract) {

        return await Conversation.query()
            .where('conversation_key', request.qs().room_id)
            .preload('messages')
            .preload('post', post => {
                post.select('slug', 'title')
            })
            .firstOrFail()

            .then(conversation => {
                return {
                    success: true,
                    conversation
                }
            })
            .catch( err => {
                return {
                    success: false,
                    error: err.message
                }
            })

    }

    public async destroy({}: HttpContextContract) {
    }
}
