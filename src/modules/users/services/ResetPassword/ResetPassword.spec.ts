import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../../repositories/fakes/FakeUserTokenRepository';

import ResetPasswordService from '../ResetPassword/ResetPasswordService';

import FakeHashProvider from '../../providers/hashProvider/fakes/FakeHashProvider';


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUsersTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUsersTokenRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider
        );
    })


    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'whermerson',
            email: 'whermersonc@gmail.com',
            password: '123456'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const hashProvider = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            token,
            password: "654321",
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(hashProvider).toBeCalledWith('654321');
        expect(updatedUser?.password).toBe('654321');
    });

    it('should not be able to reset password whit non-existing token', async() => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password whit non-existing user', async() => {

        const { token } = await fakeUserTokenRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more than 2 hours', async() => {
        const user = await fakeUsersRepository.create({
            name: 'whermerson',
            email: 'whermerson@email.com',
            password: '123456'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        
        // com o mockImplementation eu posso alterar o retorno que ocorre depois que determinada função é chamada
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 4)
        });

        await expect(
            resetPassword.execute({
                password: '123456789',
                token
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});