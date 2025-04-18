
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Employer } from 'src/entity/Employers.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employer)
    private EmployersRepository: Repository<Employer>,
    private jwtService: JwtService
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    const user = await this.EmployersRepository.findOne({where:{login:login}})
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userid: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
