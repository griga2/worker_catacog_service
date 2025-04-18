import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Department } from 'src/entity/Departments.entity';
import { Employer } from 'src/entity/Employers.entity';
import { Role } from 'src/entity/Roles.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ScriptsService {

    constructor(
            @InjectRepository(Employer)
            private EmployersRepository: Repository<Employer>,
            @InjectRepository(Role)
            private rolesRepository: Repository<Role>,
            @InjectRepository(Department)
            private departmensRepository: Repository<Department>,
            @InjectDataSource() private dataSource: DataSource,
        ) {
           
        }

    async importBranches(branches:Array<{ID: string,FatherID: string,Name: string}>) {
        const new_branches = []
        for (let br of branches) {
            if (br.FatherID == null) {
                const new_br = await this.departmensRepository.create({name:br.Name})
                new_branches.push({wap_id:br.ID, new_id: new_br.id});
                this.departmensRepository.save(new_br);
            } else {
                const new_br = await this.departmensRepository.create({name:br.Name,father_id:new_branches.find((el) => el.wap_id === br.ID).new_id})
                new_branches.push({wap_id:br.ID, id: new_br.id});
                this.departmensRepository.save(new_br);
            }
        }
    }


}
