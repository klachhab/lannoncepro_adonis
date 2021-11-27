import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Conversation from "App/Models/Conversation";
import User from "App/Models/User";


export default class ConversationsController {

    public async index({auth}: HttpContextContract) {
        const user = auth.user as User

        return user.related('conversations')
            .query()
            .preload('messages', messages => {
                messages.groupOrderBy('created_at', 'desc')
                    .groupLimit(1)
            })
            // .preload('post', post => {
            //     post
            //         .preload('images', images => {
            //             images.select('path').limit(1)
            //         })
            //         .select('id', 'title', 'slug')
            // })

        return user.related('posts')
            .query()
            .has('conversations')
            .preload('conversations', conversations => {
                conversations.preload('messages')
            })
            .preload('images', images => {
                images.select('path')
                    .firstOrFail()
                    .then(image => {
                        return image
                    })
            })
            .select('slug', 'title', 'user_id', 'id')
            .then(posts => {
                const unread_message_filter = posts.filter(post => post.has_unread_message == true)
                return {
                    conversations: posts,
                    unread_message: unread_message_filter.length,
                    has_unread_message: unread_message_filter.length !== 0,
                }
            })
            .catch( err => {
                return {
                    success: false,
                    error: err.message
                }
            })
    }


    public async show({request, view}: HttpContextContract) {
        const chatroom = await Conversation.query()
            .where('conversation_key', request.qs().room_id)

            .preload('messages')

            .preload('post', post => {
                post.select('id','slug', 'title', 'createdAt')
            })
            .firstOrFail()

            .then(conv => {

                conv.read = true

                return conv.save()
                    .then( conversation => {
                        return {
                            success: true,
                            conversation
                        }
                    })


            })
            .catch( err => {
                return {
                    success: false,
                    error: err.message
                }
            })

        if (request.qs().api){
            return chatroom
        }

        return view.render('chatroom', {
            chatroom
        })
    }

    public async destroy({}: HttpContextContract) {
    }
}
