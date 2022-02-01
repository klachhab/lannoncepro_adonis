import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class RegisterVerification extends BaseMailer {
    /**
     * WANT TO USE A DIFFERENT MAILER?
     *
     * Uncomment the following line of code to use a different
     * mailer and chain the ".options" method to pass custom
     * options to the send method
     */

    // public mailer = this.mail.use()

    constructor(private user: User) {
        super();
    }
    /**
     * The prepare method is invoked automatically when you run
     * "RegisterVerification.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */
    public prepare(message: MessageContract) {
        message
            .subject( 'E-mail de bienvenue' )
            .from( 'admin@lannoncepro.fr', "L'Annonce Pro" )
            .to( this.user.email, this.user.name )
            .htmlView('emails/register_verify', {
                user: this.user,
                host: `http://${Env.get('HOST')}:${Env.get('PORT')}`
            })
    }
}
