import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Conversation from "App/Models/Conversation";
import Env from "@ioc:Adonis/Core/Env";

export default class PostMessageSent extends BaseMailer {
    /**
     * WANT TO USE A DIFFERENT MAILER?
     *
     * Uncomment the following line of code to use a different
     * mailer and chain the ".options" method to pass custom
     * options to the send method
     */
    // public mailer = this.mail.use()

    constructor(private conversation: Conversation, private name: string, private email: string) {
        super();
    }

    /**
     * The prepare method is invoked automatically when you run
     * "PostMessageSent.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */
    public prepare(message: MessageContract) {
        message
            .subject( 'Message envoyé' )
            .from( 'support@lannoncepro.fr', "L'Annonce Pro" )
            .to( this.email, this.name )
            .htmlView( 'emails/message_received', {
                name: this.name,
                conversation: this.conversation,
                host: `http://${Env.get( 'HOST' )}:${Env.get( 'PORT' )}`
            } )

    }
}
