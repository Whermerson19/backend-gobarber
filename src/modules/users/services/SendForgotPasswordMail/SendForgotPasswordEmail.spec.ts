import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../../repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from '../SendForgotPasswordMail/SendForgotPasswordEmailService';


let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUsersTokenRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokenRepository
        );
    })


    it('should be able to recover the password using email adress', async () => {

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'whermerson',
            email: 'whermersonc@gmail.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({
            email: "whermersonc@gmail.com"
        });

        expect(sendEmail).toHaveBeenCalled();
    });

    it('should not be able to recovery a non-existing user password', async() => {
       
        await expect(sendForgotPasswordEmail.execute({
            email: "whermersonc@gmail.com"
        })).rejects.toBeInstanceOf(AppError);
    })

    it('should generate a forgot password token', async() => {
       

        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'whermerson',
            email: 'whermersonc@gmail.com',
            password: '123456'
        })

        await sendForgotPasswordEmail.execute({
            email: "whermersonc@gmail.com"
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })
});