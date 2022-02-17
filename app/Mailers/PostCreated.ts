import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from "@ioc:Adonis/Core/Env";
import Post from "App/Models/Post/Post";

export default class PostCreated extends BaseMailer {
    /**
     * WANT TO USE A DIFFERENT MAILER?
     *
     * Uncomment the following line of code to use a different
     * mailer and chain the ".options" method to pass custom
     * options to the send method
     */
    // public mailer = this.mail.use()

    constructor(private post: Post) {
        super();
    }

    /**
     * The prepare method is invoked automatically when you run
     * "PostCreated.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */
    public prepare(message: MessageContract) {
        message
            .subject( "Annonce crée" )
            .from( 'support@lannoncepro.fr', "L'Annonce Pro" )
            .to( this.post.user.email, this.post.user.name )
            .htmlView( 'emails/post_created', {
                post: this.post,
                host: `http://${Env.get( 'HOST' )}:${Env.get( 'PORT' )}`
            } )
    }
}
