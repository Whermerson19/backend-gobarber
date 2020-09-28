import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {

    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport(
                {
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    }
                }
            );
    
            this.client = transporter;
        });
    }

    public async sendMail(to: string, body: string) {
        const message = await this.client.sendMail({
            from: 'Test <teste-envio@teste.com>',
            to,
            subject: 'Recuperação de senha',
            text: body,
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Previwe URL: %s', nodemailer.getTestMessageUrl(message));
    }
}