import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class ResetPassword extends BaseMailer {
    /**
     * WANT TO USE A DIFFERENT MAILER?
     *
     * Uncomment the following line of code to use a different
     * mailer and chain the ".options" method to pass custom
     * options to the send method
     */

    // public mailer = this.mail.use()

    /**
     * The prepare method is invoked automatically when you run
     * "ResetPassword.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */

    constructor(private user: User) {
        super();
    }

    public prepare(message: MessageContract) {
        message
            .subject( 'Réinitialisation du mot de passe' )
            .from( 'support@lannoncepro.fr', "L'Annonce Pro" )
            .to( this.user.email, this.user.name )
            .htmlView('emails/reset_password', {
                user: this.user,
                host: `http://${Env.get('HOST')}:${Env.get('PORT')}`
            })
    }
}
