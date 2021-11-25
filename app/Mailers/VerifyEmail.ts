import {BaseMailer, MessageContract} from '@ioc:Adonis/Addons/Mail'
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class VerifyEmail extends BaseMailer {
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
     * "VerifyEmail.send".
     *
     * Use this method to prepare the email message. The method can
     * also be async.
     */

    constructor(private user: User, private hashed_password?: string) {
        super();
    }

    public prepare(message: MessageContract) {

        message
            .subject("Profile verification")
            .from('noreply@example.com', "LannoncePro - noreply")
            .to(this.user.email, this.user.name)
            .htmlView('emails/verify', {
                user: this.user,
                hashed_password: this.hashed_password || null,
                base_url: `http://${Env.get('HOST')}:${Env.get('PORT')}/verify?key=${ this.user.verification_code}`
            })
    }
}
