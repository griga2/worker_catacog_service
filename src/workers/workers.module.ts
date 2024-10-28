import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpoyerSchema } from './schame/empoyer.schame';
import { BranchSchema } from './schame/branch.schame';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/Users.entity';
import { Roles } from './entity/Roles.entity';
import { Departments } from './entity/Departments.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Roles]),
    TypeOrmModule.forFeature([Departments]),
  ],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [ WorkersService],
})
export class WorkersModule {}
