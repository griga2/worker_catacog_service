import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpoyerSchema } from './schame/empoyer.schame';
import { BranchSchema } from './schame/branch.schame';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employer } from '../entity/Employers.entity';
import { Role } from '../entity/Roles.entity';
import { Department } from '../entity/Departments.entity';
import { Contact } from 'src/entity/Contacts.entity';
import { Photo } from 'src/entity/Photo.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Employer]),
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Department]),
    TypeOrmModule.forFeature([Contact]),
    TypeOrmModule.forFeature([Photo]),
  ],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [ WorkersService],
})
export class WorkersModule {}
