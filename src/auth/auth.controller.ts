import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }
    
    @HttpCode(HttpStatus.OK)
    @Post('/loginUser')
    async loginUser(@Query('login') login, @Query('password') password) {
        
    }
}
