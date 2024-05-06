import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes,scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { instanceToPlain } from 'class-transformer';

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    //see if the email is in use
    const user = await this.userService.find(email);
    const serializeUser = instanceToPlain(user)
    if (serializeUser) {
      throw new BadRequestException('email in use');
    }
    //hash the users password
    //generate the salt that has 16 characters
    const salt = randomBytes(8).toString('hex')
    //hash the salt and the password together
    const hash = (await scrypt(password,salt,32)) as Buffer
    const result = salt +'.' + hash.toString('hex')
    //create a new user and save it
    const newUser = this.userService.create(email,result)
    //return the user
    return newUser
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.find(email);
    const serializeUser = instanceToPlain(user)
    if (!serializeUser) {
      throw new NotFoundException('user not found');
    }
    const salt = user.password.split('.')[0]
    const hash = (await scrypt(password,salt,32)) as Buffer
    const result = salt +'.' + hash.toString('hex')
    if(user.password !== result){
        throw new BadRequestException('wrong password')
    }
    return user
  }
}
