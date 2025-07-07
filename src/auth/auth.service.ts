
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { Employer } from 'src/entity/Employers.entity';
import { DataSource, Repository } from 'typeorm';
import { decode } from 'jsonwebtoken';
import e from 'express';


@Injectable()
export class AuthService {
  async getUserDate(token: string) {
      console.log(token)
      const a = JSON.parse(Buffer.from( token.split('.')[1], 'base64').toString());
      console.log(a);
      return await this.GetUser(a.mail)
  }
  constructor(
    @InjectRepository(Employer)
    private EmployersRepository: Repository<Employer>,
    private jwtService: JwtService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async Login(login: string, pass: string): Promise<any> {
    console.log(login + '' + pass,'login user')
    const users = (await this.dataSource.query(`
      SELECT TOP (1)
        ct.EmployeeID,
        em.Id,
        em.Name,
        em.LastName,
        em.MidName,
        ct.Value
      FROM [SpravApp].[dbo].Contacts as ct
      LEFT JOIN Employees AS em
      ON em.ID  = ct.EmployeeID 
      WHERE ct.Type = 'email' 
      AND ct.Value LIKE('%${login}%')
      AND 'veryhardpass' = '${pass}'
    `))

    if (users.length > 0) {
      const user = users[0];
      const payload = { mail: user.Value };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return ''
    }

    throwError(() => {
      return 'err';
    });
    return 'a';
  }

  async GetUser (mail) {
    console.log(mail,'login user')
    const users = (await this.dataSource.query(`
     SELECT TOP (1)
      ct.EmployeeID,
      em.Id as EmID,
      em.Name,
      em.LastName,
      em.MidName,
      ct.Value,
      rl.Name as RoleName,
      rl.ID as roleID
    FROM [SpravApp].[dbo].Contacts as ct
    LEFT JOIN Employees AS em
    ON em.ID  = ct.EmployeeID 
    LEFT JOIN Roles AS rl
    ON rl.ID = em.RoleID
    WHERE ct.Type = 'email' 
    AND ct.Value LIKE('%${mail}%')
    `)).map((el) => {
      {
        return {
          name: el.LastName + '' + el.Name + ' ' + el.MidName,
          role: el.RoleName,
          id: el.EmID
        }
      }
    });
    console.log(users[0]);  
    return users[0];
  }
}
