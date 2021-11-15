import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Conversation from "App/Models/Conversation";

export default class ConversationsController {
    public async index({}: HttpContextContract) {
    }

    public async create({}: HttpContextContract) {
    }

    public async store({}: HttpContextContract) {
    }

    public async show({request, view}: HttpContextContract) {

        const chatroom = await Conversation.query()
            .where('conversation_key', request.qs().room_id)
            .preload('messages')
            .preload('post', post => {
                post
                    .preload('images', images => {
                        images
                            .select('path')
                            .firstOrFail()
                            .then( image => {
                                return image
                            })
                            .catch( () => {
                                return null
                            })
                    })
                    .preload('user', user => {
                    user.select('name', 'title', 'createdAt')
                })
                    .select('slug', 'title', 'userId', 'createdAt')
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

        if (request.qs().api){
            return {
                chatroom,
                messages: chatroom
                    .conversation.messages
            }
        }

        return view.render('chatroom', {
            chatroom
        })
    }

    public async destroy({}: HttpContextContract) {
    }
}
