import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(
        public usersService:UsersService,
        private authService:AuthService
    ){}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() currentUser:any){
        return this.usersService.findOne(currentUser)
    }

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto,@Session() session:any){
        const {email,password} = body
        const user = await this.authService.signUp(email,password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signIn(@Body() body:CreateUserDto,@Session() session:any){
        const {email,password} = body
        const user = await this.authService.signIn(email,password)
        session.userId = user.id
        return user
    }

    @Post('/signout')
    async signOut(@Session() session:any){
        session.userId = null
    }
    
    @Get('/:id')
    findUser(@Param('id') id:string){
        let user = this.usersService.findOne(parseInt(id))
        if(!user){
            throw new NotFoundException('user not found')
        }
        return user
    }

    @Get()
    getAllUser(){
        return this.usersService.findAll()
    }

    @Get()
    findAllUsersByEmail(@Query('email') email:string){
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string,@Body() body:UpdateUserDto){
        return this.usersService.update(parseInt(id),body)
    }
}
