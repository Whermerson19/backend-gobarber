import nodemailer, { Transporter } from 'nodemailer';

import { injectable, inject } from 'tsyringe';
 
import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailProvider from '../models/IMailProvider';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {

    private client: Transporter

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
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

    public async sendMail({ to, from, subject, templateData }: ISendMailDTO) {
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'Equipe Gobarber',
                address: from?.email || 'teste@teste.com'
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Previwe URL: %s', nodemailer.getTestMessageUrl(message));
    }
}