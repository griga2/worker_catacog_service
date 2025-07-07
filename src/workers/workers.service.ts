import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Empoyer } from './schame/empoyer.schame';
import { Branch } from './schame/branch.schame';
import { Employer } from '../entity/Employers.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity/Roles.entity';
import { Department } from '../entity/Departments.entity';
import { retry } from 'rxjs';
import { Contact } from 'src/entity/Contacts.entity';
import { Photo } from 'src/entity/Photo.entity';
import * as AWS from 'aws-sdk';
import e from 'express';
import axios, { RawAxiosRequestHeaders, AxiosRequestConfig } from 'axios';
@Injectable()
export class WorkersService {
    async updateUserBio(bio: any, userId: any) {
        return await this.EmployersRepository.update({id:userId},{bio: bio})
    }

    bitrixUrls = {
            fistday:"rest/2240/yc94bzed628o2vvq/crm.item.add",
            empluy: "rest/2240/yc94bzed628o2vvq/crm.item.add",
            remove: "rest/2240/yc94bzed628o2vvq/crm.item.add"
        } 
    

    hiringEmployer(ID: any, roleID, hrMail) {
        const d = new Date();
        this.createStreamRediWorkCreate({
            entityTypeId: '1116',
            fields: {
                ufCrm54SpravId:ID,
                ufCrm54UserFunctions: "",
                ufCrm54VestaBase: "",
                ufCrm54RoleAnalog: roleID,
                ufCrm54EmploymentDate: d.toISOString(),
                ufCrm54HrEmail: hrMail
            }
        })
    }


    async addUser(body: any) {
        return await this.EmployersRepository.query(`
            DECLARE @IDEmp uniqueidentifier = NEWID();

            INSERT INTO Employees (
            ID,
            Name
            )
            VALUES (
                @IDEmp,
                'Новый Сотрудник'
            )

            SELECT @IDEmp AS NewID

            INSERT INTO EmpToDepIndex (
                DepartmentID
                ,EmployeeID
            ) VALUES (
                '${body.departament}'
                ,@IDEmp
            )
        `)
    }

    async getCatalogInfo(company: string) {
        let branches = (await this.departmensRepository.find(
            {
                where: {
                    id:company
                },
                relations:{
                },
                
            },
        )).map(el => {return {
            id: el.id,
            name: el.name,
            chief_id: el.chief_id,
            adress: el.address,
            father_id: el.father_id,
            is_open: true,  
            children:[],
            have_children: false,
            orderNum: el.orderNum,
            timeOffset: el.timeOffset,
            сity: el.сity,
            MonFriday: el.monFriday || false,
            Saturday: el.saturday || false,
            Sunday: el.sunday || false,
            sundayClosing: el.sundayClosing,
            sundayOpenning: el.sundayOpenning,
            saturdayClosing: el.saturdayClosing,
            saturdayOpenning: el.saturdayOpenning,
            monFridayClosing: el.monFridayClosing,
            monFridayOpenning: el.monFridayOpenning,
            isOfficeDepartment: el.isOfficeDepartment,
            isOfficePurchase: el.isOfficePurchase,
            isStorage: el.isStorage,
            database_vesta: el.database_vesta,
            email: el.email,
            oid: el.oid,
            sql_server_vesta: el.sql_server_vesta,
            cfo: el.cfo_vest,
            id_vesta: el.id_vesta,
            different: el.sundayOpenning == el.saturdayOpenning && el.sundayClosing == el.saturdayClosing,
            close_on_holiday: !el.saturday && !el.sunday,
            edit_time: false,
        }});

        return branches[0];
    }

    async updateUserRole(userId: any, role: any) {
        return await this.EmployersRepository.update({id:userId}, {role: role})
    }


    deleteBranch(branchId: any) {
        throw new Error('Method not implemented.');
    }

    async UpdateUserPhotoUrl(rez: AWS.S3.ManagedUpload.SendData, employerId) {
        console.log(rez.Location,'');
        console.log(rez.Location.replace('https://136703eb-05e89941-0f10-4e65-b543-d67d43f62dea.s3.timeweb.cloud',employerId));
        const reze = await this.EmployersRepository.update({id: employerId}, {photo: rez.Location.replace('https://136703eb-05e89941-0f10-4e65-b543-d67d43f62dea.s3.timeweb.cloud','').trim()});
        console.log(reze);
        const r = await this.EmployersRepository.findOne({where:{id: employerId}})

        return {
            Photo: r.photo.trim(),
        }
    }

    MainContactTypes = ['workPhone','mPhone','email']
    
    constructor(
        @InjectRepository(Employer)
        private EmployersRepository: Repository<Employer>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(Department)
        private departmensRepository: Repository<Department>,
        @InjectRepository(Contact)
        private contactsRepository: Repository<Contact>,
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        @InjectDataSource() private dataSource: DataSource,
    ) {
       
    }

    async getEmployers(company) {
        console.log(' emp awd')
        const rez =  (await this.dataSource.query(`
                SELECT e.[ID]
                    ,e.[LastName]
                    ,e.[Name]
                    ,e.[MidName]
                    ,e.[Birthday]
                    ,e.[EmploymentDate]
                    ,e.[Dismissed]
                    ,e.[DismissionDate]
                    ,e.[Status]
                    ,e.[Sex]
                    ,e.[City]
                    ,e.[Photo]
                    ,d.[Name] AS DepartamentName
				    ,rl.[Name] AS RoleName
                    ,rl.[Id] AS RoleId
                    ,rl.[CanEditSprav] AS CanEditSprav
                    ,e.[BirthdayString]
                    ,(SELECT convert(nvarchar(36), id) + ':' + Type + ':' + Value + ';' FROM [dbo].Contacts WHERE [EmployeeID] = e.ID ORDER BY [Type] FOR XML PATH('')) AS Contacs
                	,(SELECT convert(nvarchar(36), ID) + ':' + Name + ';' FROM [dbo].Roles WHERE [ID] = e.RoleID FOR XML PATH('')) AS Roles
                FROM [dbo].[Employees] AS e
                INNER JOIN EmpToDepIndex AS ed 
                    ON e.ID = ed.EmployeeID 
                INNER JOIN Departments AS d 
                    ON d.ID = ed.DepartmentID	
                LEFT JOIN Roles As rl
                    ON rl.ID = e.RoleID
                WHERE ed.DepartmentID = '${company}'
                ORDER BY d.[Name], LastName
            `)).map(el => {
            return {
                ...el,
                full_name:   el.LastName + " " +  el.Name + " " + el.MidName ,
                department_name: el.DepartamentName,
                Photo: el.Photo?.trim(),
                    role: el.RoleId ? {
                    name: el.RoleName,
                    id: el.RoleId
                } : null
             }
        })

        rez.map(el => {
            if (!el.Contacs) {
                el.Contacs = "";
            }
            const contacts = el.Contacs;
            let not_have_type = this.MainContactTypes;
            el.Contacs =  contacts.split(';').map(elc => {
                const rez = elc
                .split(':')
                .map(eld => { eld = eld.replace(';','').replace(',','').trim(); return eld});
                not_have_type = not_have_type.filter(el => el != rez[1])
                return rez;
            })
            el.Contacs = el.Contacs.slice(0,el.Contacs.length - 1);
            this.MainContactTypes.forEach((elf) => {
                if (not_have_type.includes(elf)) {
                    el.Contacs.push(['', elf,''])
                }
            })
            el.Contacs.sort((a, b) => {
                if (a.type > b.type) {
                  return -1;
                }
                if (a.type < b.type) {
                  return 1;
                }
                // если имена равны
                return 0;
            })
            el.Contacs = this.mapContacts(el.Contacs)
            // const roles = el.Roles;
            // console.log(roles)
            // el.Roles =  roles.split(';').map(elc => {
            //     const rez = elc
            //     .split(':')
            //     .map(elt => { el = elt.replace(';','').replace(':','').trim(); return {id: elt[0], name: elt[1]}});
            //     console.log(rez)
            //     return rez;
            // })
            // el.Roles = el.Roles.slice(0,el.Roles.length - 1);
            
            let date = new Date(el.EmploymentDate);
            el.EmploymentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${(date.getDay() + 1).toString().padStart(2,'0')}`;
            date = new Date(el.Birthday);
            el.Birthday = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${(date.getDay() + 1).toString().padStart(2,'0')}`;
            
            return el;
        })
        return rez;
    }

    async CreateOrUpdateContact(body) {
        console.log(body)
        if (body.id) {
            console.log('update');
            await this.contactsRepository.update({ID:body.id},{
                Value: body.value
            })
        } else {
            //create
            console.log('create');
            const rez = await this.contactsRepository.insert({
                Type: body.type,
                Value: body.value,
                EmployeeID: body.userId,
                IsMain: null
            })
        }
        return (await this.dataSource.query(`
            SELECT TOP (1000) [EmployeeID]
                ,[ID]
                ,[Type]
                ,[Value]
                ,[IsMain]
            FROM [SpravApp].[dbo].[Contacts]
            WHERE [EmployeeID] = '${body.userId}'
            ORDER BY Type;
        `)).map((el) => {
            return [el.ID,el.Type,el.Value]
        })
    }

    async searchEmployers(query: string, date: string) {
        const dates = JSON.parse(date || null);
        console.log(query);
        let  orderStr = "";
        let  dateStr = "";
        if (dates == null) {
            orderStr = "ORDER BY d.[Name], e.LastName ";
        } else {
            console.log('search awd')
            orderStr = "ORDER BY MONTH(e.[Birthday]), DAY(e.[Birthday]);"
            dateStr = `AND FORMAT(e.[Birthday], 'MM-dd')  BETWEEN  FORMAT(CONVERT(datetime, '${dates[0]}'), 'MM-dd') AND  FORMAT(CONVERT(datetime, '${dates[1]}'), 'MM-dd')`
        }
        
        const rez =  (await this.dataSource.query(`
            SELECT e.[ID]
                ,e.[LastName]
                ,e.[Name]
                ,e.[MidName]
                ,e.[Birthday]
                ,e.[EmploymentDate]
                ,e.[Dismissed]
                ,e.[DismissionDate]
                ,e.[Status]
                ,e.[Photo]
                ,e.[City]
                ,e.[Sex]
                ,d.[Name] AS DepartamentName
                ,d.[ID] AS DepartamentID
                ,rl.[Name] AS RoleName
                ,e.[BirthdayString]
                ,(SELECT convert(nvarchar(36), id) + ':' + Type + ':' + value + ';' FROM [dbo].Contacts WHERE [EmployeeID] = e.ID ORDER BY [Type] FOR XML PATH('')) AS Contacs
                ,(SELECT convert(nvarchar(36), rl.ID) + ':' + rl.Name + ';' FROM [dbo].Roles AS rl WHERE [ID] = e.RoleID FOR XML PATH('')) AS Roles
            FROM [dbo].[Employees] AS e
            INNER JOIN EmpToDepIndex AS ed 
                ON e.ID = ed.EmployeeID 
            INNER JOIN Departments AS d 
                ON d.ID = ed.DepartmentID	
            INNER JOIN Roles As rl
                ON rl.ID = e.RoleID
            WHERE 
                ( 
                    e.[Name] LIKE ('%${query}%')
                    OR e.[MidName] LIKE ('%${query}%')
                    OR e.[LastName] LIKE ('%${query}%')
                    OR (SELECT convert(nvarchar(36), id) + ':' + Type + ':' + value + ';' FROM [dbo].Contacts WHERE [EmployeeID] = e.ID ORDER BY [Type] FOR XML PATH('')) LIKE ('%${query}%')
                )
            ${dateStr}
            ${orderStr}
        `)).map(el => {
        return {
            ...el,
            full_name: el.LastName + " " + el.Name + " " + el.MidName,
            department_name: el.DepartamentName,
            departament_id: el.DepartamentID,
            Photo: el.Photo?.trim(),
            role: el.RoleId ? {
                name: el.RoleName,
                id: el.RoleId
            } : null
         }
    })

    rez.map(el => {
        if (!el.Contacs) {
            el.Contacs = "";
        }
        const contacts = el.Contacs;
        let not_have_type = this.MainContactTypes;
        el.Contacs =  contacts.split(';').map(elc => {
            const rez = elc
            .split(':')
            .map(eld => { eld = eld.replace(';','').replace(',','').trim(); return eld});
            not_have_type = not_have_type.filter(el => el != rez[1])
            return rez;
        })
        el.Contacs = el.Contacs.slice(0,el.Contacs.length - 1);
        this.MainContactTypes.forEach((elf) => {
            if (not_have_type.includes(elf)) {
                el.Contacs.push(['', elf,''])
            }
        })
        el.Contacs.sort((a, b) => {
            if (a.type > b.type) {
              return -1;
            }
            if (a.type < b.type) {
              return 1;
            }
            // если имена равны
            return 0;
        })
        el.Contacs = this.mapContacts(el.Contacs)
        // const roles = el.Roles;
        // console.log(roles)
        // el.Roles =  roles.split(';').map(elc => {
        //     const rez = elc
        //     .split(':')
        //     .map(elt => { el = elt.replace(';','').replace(':','').trim(); return {id: elt[0], name: elt[1]}});
        //     console.log(rez)
        //     return rez;
        // })
        // el.Roles = el.Roles.slice(0,el.Roles.length - 1);
        
        const datee = new Date(el.EmploymentDate);
        el.EmploymentDate = `${datee.getFullYear()}-${(datee.getMonth() + 1).toString().padStart(2,'0')}-${(datee.getDate()).toString().padStart(2,'0')}`;
        const dateb = new Date(el.Birthday);
        el.Birthday = `${dateb.getFullYear()}-${(dateb.getMonth() + 1).toString().padStart(2,'0')}-${(dateb.getDate()).toString().padStart(2,'0')}`;
        
        return el;
    })
    return rez;
    }

    async UploadPhoto(photo: Express.Multer.File, employerId: string) {
        return await this.uploadFile(photo, employerId);
    }
    
    async getBranches() {
        let branches = (await this.departmensRepository.find(
            {
                relations:{
                },
                
            },
          )).map(el => {return {
            id: el.id,
            name: el.name,
            chief_id: el.chief_id,
            adress: el.address,
            father_id: el.father_id,
            is_open: true,  
            children:[],
            have_children: false,
            orderNum: el.orderNum,
            timeOffset: el.timeOffset,
            сity: el.сity,
            MonFriday: el.monFriday || false,
            Saturday: el.saturday || false,
            Sunday: el.sunday || false,
            sundayClosing: el.sundayClosing,
            sundayOpenning: el.sundayOpenning,
            saturdayClosing: el.saturdayClosing,
            saturdayOpenning: el.saturdayOpenning,
            monFridayClosing: el.monFridayClosing,
            monFridayOpenning: el.monFridayOpenning,
            isOfficeDepartment: el.isOfficeDepartment,
            isOfficePurchase: el.isOfficePurchase,
            isStorage: el.isStorage,
            database_vesta: el.database_vesta,
            email: el.email,
            oid: el.oid,
            sql_server_vesta: el.sql_server_vesta,
            cfo: el.cfo_vest,
            id_vesta: el.id_vesta,
            different: el.sundayOpenning == el.saturdayOpenning && el.sundayClosing == el.saturdayClosing,
            close_on_holiday: !el.saturday && !el.sunday,
            edit_time: false,
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
                        temp_branches.push(els.id);
                    })
                    el.children = el.children.sort((a, b) => {
                        if (a.orderNum > b.orderNum) {
                            return 1;
                        } else {
                            return -1;
                        }
                    })
                }
                return el;
            })
            finish_child = finish_child.filter(el => !temp_branches.includes(el.id)); 
            metka = finish_child.some(el => finish_child.filter(els => els.id == el.father_id).length > 0);
        }
        finish_child = finish_child.sort((a, b) => {
            if (a.orderNum > b.orderNum) {
                return 1;
            } else {
                return -1;
            }
        })
        return finish_child;
    }

    async updateBranch(branchId:string, body) {
        const data: Department = {
            address: body.address || "",
            father_id: body.father_id || null,
            email: body.email,
            // monFridayOpenning: body.Workday?.monFidayOpenning || null,
            // monFridayClosing: body.Workday?.monFridayClosing || null,
            name: body?.name || "",
            orderNum: body?.orderNum.toString() || '0',
            // saturdayClosing: body.Workday?.saturdayClosing || null,
            // saturdayOpenning: body.Workday?.saturdayOpenning || null,
            // sundayClosing: body.Workday?.sundayOpenning || null,
            // timeOffset: body.Workday?.timeOffset || null,
            chief_id: body.chief_id || null,
            сity: body.city || "",
            // sundayOpenning: body.Workday?.SundayOpenning || null,
            // monFriday: body.Workday?.monFriday || null,
            // saturday: body.Workday?.saturday || null,
            // sunday: body.Workday?.sunday || null,
            time_ping: body.time_ping || 0,
            cfo_vest: body.cfo || '',
            sql_server_vesta: body.sql_server_vesta || '',
            database_vesta: body.database_vesta || '',
            id_vesta: body.id_vesta || '',
            oid: body.oid || '',
            isOfficeDepartment: body.isOfficeDepartment ? 1 : 0,
            isOfficePurchase: body.isOfficePurchase ? 1 : 0,
            isStorage: body.isStorage  ? 1 : 0
        }
        
        console.log(data);
        console.log(branchId);
        const rez = await this.departmensRepository.update({id:branchId},data);
        console.log(rez);
        return rez;
    }

    async updateUser(userId: string, body) {

        const data: Employer = {
            last_name: body.last_name,
            first_name: body.first_name,
            second_name: body.second_name,
            birthday: body.birthday,
            status: body.status,
            photo: body.photo?.trim(),
            sex: body.sex,
            city: body.city,

        }
        console.log(body)
        console.log(userId)
        const rez = await this.EmployersRepository.update({id:userId},data);
        console.log(rez);
        return rez;
    }

    async getAllChildBranches(currentChild: string) {
        let branches = (await this.departmensRepository.find(
            {relations:{
            }}
          )).map(el => {return {
            id: el.id,
            name: el.name,
            chief_id: el.chief_id,
            adress: el.address,
            father_id: el.father_id,
            is_open: true,  
            children:[],
            have_children: false,
        }}), 
        temp_branches,
        metka = true, 
        rez_branches = [],
        temp_metka, 
        find_cur_br = {},
        finish_child = branches.filter(i => branches.filter(y => y.father_id == i.id).length == 0);
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
        
        let a = "";
        finish_child.forEach((el) => {
            const b = this.findBrancheINnTree(el,currentChild);
            if(b) a = b;
        });
        console.log("a",a);
        return this.getAllChild(a, []);
    }

    getAllChild(find_cur_br, all_children): Array<String> {
        let children = all_children;
        console.log(children)
        if (find_cur_br.children.length > 0) {
           find_cur_br.children.forEach((el) => {
            console.log(el)
            children = this.getAllChild(el,children);
           })
        } else {
            children.push(find_cur_br.id);
        }

        return children;
    }
    
    findBrancheINnTree(node, currentBr) {
        if (currentBr == node.id) return node;
        if (node.children.length > 0 ) {
            for (const el of node.children ) {
                const rez = this.findBrancheINnTree(el,currentBr);
                if (rez) { console.log(rez, 'finish'); return rez };
            };
        } else {
            return null;
        }
        return null;
        console.log('finish fun')
    }

    async getRoles() {
        return (await this.rolesRepository.find()).sort((a,b) => {
            if (a.index > b.index) return 1;
            if (a.index < b.index) return -1;
            return 0;
        });
    }

    async addRoles(last_role_index, name) {
        await this.rolesRepository.insert({index:last_role_index--, name: name});
        return await this.rolesRepository.find({order:{index:1}});
    }

    async updateRoles(role) {
        await this.rolesRepository.update({id: role.id},{name: role.name});
        return await this.rolesRepository.find({order:{index:1}});
    }

    async moveRoles(role, axis) {
        const rl = await this.rolesRepository.findOne({where:{id:role}})
        console.log(rl);
        await this.rolesRepository.update({id:role},{index: axis == 'up'? rl.index + 1 : rl.index - 1});
        return await this.rolesRepository.find({order:{index:-1,name: 1}});
    }

    AWS_S3_BUCKET = '136703eb-05e89941-0f10-4e65-b543-d67d43f62dea';
    s3 = new AWS.S3({
        endpoint: 'https://s3.timeweb.cloud',
        accessKeyId: 'IENPS9ZR3JD95TAO4LYR',
        secretAccessKey: 'zXWLFHrbqkZ8mxrYo1AprkdHBwgopttz9FHmDbaC',
    });
  
    async uploadFile(file, id) {
      console.log(file);
      const { originalname } = file;
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        originalname,
        file.mimetype,
      );
    }   
  
    async s3_upload(file, bucket, name, mimetype) {
      const params = {
        Bucket: bucket,
        Key: String(name),
        Body: file,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: 'ap-south-1',
        },
      };
  
      try {
        let s3Response = await this.s3.upload(params).promise();
        return s3Response;
      } catch (e) {
        console.log(e);
      }
    }

    async getInsertBranch(branchId, newFatherId) {
        return await this.departmensRepository.update({id:branchId}, {father_id: newFatherId});
    }

    async moveBranch(branchId, direction) {
        const branch = await this.departmensRepository.findOne({where:{id:branchId}});
        const branches = await this.departmensRepository.find({where:{father_id: branch.father_id}, select: {orderNum: true}});

        if (true) {

        } else {

        }
    }

    mapContacts(roles) {
        // console.log((roles),'contacts')
        const ma = Array.from(
         roles.reduce((map, item) => {
            if (!map.has(item[2])) {
              map.set(item[2], item);
            }
            return map;
          }, new Map())
          .values()
      );
      return ma
    }
    
    async createStreamRediWorkCreate(data) {
        console.log(data,'createStreamRediWorkCreate')
        this.RequesNahyi(data)
    }

    async createStreamRemoveWorker(data) {
        console.log(data,'createStreamRemoveWorker')
        this.RequesNahyi(data);
    }

    async createStreamPerevodNah(data) {
        console.log(data,'createStreamPerevodNah')

        this.RequesNahyi(data);
    }

    async createStreamFirstDay(data: { entityTypeId: string; fields: { ufCrm54SpravId: any; ufCrm54UserFunctions: string; ufCrm54VestaBase: string; ufCrm54RoleAnalog: any; ufCrm54EmploymentDate: string; ufCrm54HrEmail: any; }; }) {
        console.log(data,'createStreamFirstDay')
        
        this.RequesNahyi(data);
    }

    async addRole() {
        return await this.rolesRepository.insert({name:'Новая роль', index:0 })
    }

     async updateRole(id,name) {
        return await this.rolesRepository.update({id: id},{name:name })
    }


    async RequesNahyi(data) {
        const responce = await axios.request(this.GetConfig(data));
        const responceData = JSON.stringify(responce.data);
        const status = JSON.stringify(responce.status);
        return responce;
    }

    GetConfig(data) {
        // console.log(this.configService.get('KUBE_API'));

        // const url = this.configService.get('KUBE_API');
        const headers: RawAxiosRequestHeaders = {
        maxBodyLength: Infinity,
        'Content-Type': 'application/json',
        };
        const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://eks.bitrix24.ru/' + this.bitrixUrls.empluy,
        headers: headers,
        data: data,
        };

        // console.log(data)

        return config;
    }

}