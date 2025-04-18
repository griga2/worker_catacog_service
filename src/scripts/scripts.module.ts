import { Module } from '@nestjs/common';
import { ScriptsService } from './scripts.service';
import { ScriptsController } from './scripts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from 'src/entity/Contacts.entity';
import { Department } from 'src/entity/Departments.entity';
import { Employer } from 'src/entity/Employers.entity';
import { Role } from 'src/entity/Roles.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Employer]),
      TypeOrmModule.forFeature([Role]),
      TypeOrmModule.forFeature([Department]),
      TypeOrmModule.forFeature([Contact]),
    ],
  providers: [ScriptsService],
  controllers: [ScriptsController]
})
export class ScriptsModule {}
