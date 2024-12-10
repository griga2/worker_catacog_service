import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpoyerSchema } from './schame/empoyer.schame';
import { BranchSchema } from './schame/branch.schame';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/Users.entity';
import { Role } from '../entity/Roles.entity';
import { Department } from '../entity/Departments.entity';
import { Contact } from 'src/entity/Contacts.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Department]),
    TypeOrmModule.forFeature([Contact]),
  ],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [ WorkersService],
})
export class WorkersModule {}
