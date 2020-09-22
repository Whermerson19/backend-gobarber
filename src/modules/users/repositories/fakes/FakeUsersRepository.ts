import { v4 } from 'uuid';
import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {

    private users: User[] = [];

   
    public async findByEmail(email: string): Promise<User | undefined> {

        const findUser = this.users.find(user => Object.is(user.email, email));

        return findUser;
    }

    public async findById(id: string): Promise<User | undefined> {

        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        
        const user = new User();

        Object.assign(user, { id: v4() }, userData)

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

        this.users[findIndex] = user;

        return user;
    }
}

export default UsersRepository;