import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';


interface IMessage {
    to: string;
    body: string;
}

export default class FakeMailProvider implements IMailProvider {

    private messages: ISendMailDTO[] = [];

    public async sendMail(message: ISendMailDTO) {
        this.messages.push(message);
    }
}