import { Body, Controller, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request} from 'express'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }
    
    @HttpCode(HttpStatus.OK)
    @Post('/loginUser')
    async loginUser(@Body() body) {
        console.log('pass', body.password)
        console.log('login', body.login)
        return await this.authService.Login(body.login, body.password)
    }

    
    @Post('/getUserDate')
    async getUser(@Req() request: Request) {
        const mail = 'swa@elektro.ru';
        const token = request.headers.authorization;
        return await this.authService.getUserDate(token)
    }
}
