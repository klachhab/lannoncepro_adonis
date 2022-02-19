import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from "@ioc:Adonis/Core/Env";
import Post from "App/Models/Post/Post";

export default class PostMessageSent extends BaseMailer {
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  constructor(private post: Post, private name: string, private email: string) {
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
        .subject( 'Message reçu de la part de : ' + this.name )
        .from( this.email, this.name )
        .to( 'support@lannoncepro.fr', "L'Annonce Pro" )
        .htmlView( 'emails/message_sent', {
          name: this.name,
          post: this.post,
          host: `http://${Env.get( 'HOST' )}:${Env.get( 'PORT' )}`
        } )

  }
}
