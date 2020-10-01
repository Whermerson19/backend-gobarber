import IParseMailTemplate from '../dtos/IParseMailTemplate';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ template, variables }: IParseMailTemplate): Promise<string> {
        return template;
    }
}