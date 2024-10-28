import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Empoyer } from './schame/empoyer.schame';
import { Branch } from './schame/branch.schame';
import { Users } from '../entity/Users.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entity/Roles.entity';
import { Departments } from '../entity/Departments.entity';
import { retry } from 'rxjs';

@Injectable()
export class WorkersService {

    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,
        @InjectRepository(Departments)
        private departmensRepository: Repository<Departments>,
        @InjectDataSource() private dataSource: DataSource,
    ) {
       
    }

    async getUsers(company) {
        // return await this.empoyerModel.find({company: company});    
        return (await this.usersRepository.find({where:{department:company}})).map(el => {
            return {
                ...el,
                name: el.first_name + " " + el.second_name + " " + el.last_name,
             }
        })
    }

    async searchUsers(query: string) {
        const rez = (await this.dataSource.query(`
               (SELECT  
               Roles.Name RoleName
               ,Users.MidName + ' ' + Users.Name + ' ' + Users.LastName UserName
               ,Users.Birthday
               ,Users.Email
               ,Users.Phone
               ,Users.MobilePhone
               ,Users.Status
               ,Users.Photo
               ,Users.ID
                FROM Users LEFT JOIN Roles
                ON Roles.ID = Users.RoleID
                WHERE Users.Name LIKE '%${query}%' 
                OR Users.LastName Like '%${query}%'
                OR Users.MidName Like '%${query}%'
                OR Roles.Name Like '%${query}%'
                OR Users.Phone Like '%${query}%'
                OR Users.Email Like '%${query}%')
            `)).map(el => {
                return {
                    name: el.UserName,
                    birthday: el.Birthday,
                    role: el.RoleName,
                    photo: el.Photo,

                }   
            })
            console.log(rez)
            return rez;
    }
    
    async getBranches() {
        let branches = (await this.departmensRepository.find()).map(el => {return {
            id: el.id,
            name: el.name,
            chief_id: el.chief_id,
            adress: el.adress,
            father_id: el.father_id,
            is_open: true,  
            children:[],
            have_children: false,
        }}), 
        temp_branches,
        metka = true, 
        temp_metka, 
        finish_child = branches.filter(i => branches.filter(y => y.father_id == i.id).length == 0);
        console.log(branches.map(i => i.id));
        temp_branches = [];
        while (metka) {
            temp_metka = 0;
            metka  = true;
            finish_child = branches.map(el => {
                const find_finish_child = finish_child.filter(i => i.father_id == el.id)
                if (find_finish_child.length > 0) {
                    find_finish_child.forEach(els => {
                        el.children.push(els);
                        el.have_children = true;
                        temp_branches.push(els.id)
                    })
                }
                return el;
            })
            finish_child = finish_child.filter(el => !temp_branches.includes(el.id)); 
            metka = finish_child.some(el => finish_child.filter(els => els.id == el.father_id).length > 0);
        }
        return finish_child;
    }
}   


