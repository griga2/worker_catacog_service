import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users') //This maps the notes entity to the 'notes' table in your DB
export class Users {
    @PrimaryGeneratedColumn('uuid')
    ID: string;
  
    @Column({ name: 'LastName',})
    last_name: string;
  
    @Column({ name: 'Name',})
    first_name: string;

    @Column({ name: 'MidName',})
    second_name: string;

    @Column({ name: 'Email',})
    mail: string;

    @Column({ name: 'Birthday',})
    birthday: string;

    @Column({ name: 'Phone',})
    phone: string;

    @Column({ name: 'post',})
    post: string;

    @Column({ name: 'DepartmentID', type: 'int'})
    department: number;

    @Column({ name: 'Status',})
    status: string;

    @Column({ name: 'Photo',})
    photo: string;

    @Column({ name: 'RoleID',})
    role: string;
  }