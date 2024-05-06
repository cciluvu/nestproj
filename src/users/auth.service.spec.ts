import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('Auth Service', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve({} as User),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).not.toBeDefined();
    expect(hash).not.toBeDefined();
  });

  it('throws an error if user sign up with email that is in use', async () => {
    const user = await service.signUp('', 'asdf');
    expect(user).not.toBeDefined();
  });
});
