import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Roles.entity';
import { Contact } from './Contacts.entity';

@Entity('Employees') //This maps the notes entity to the 'notes' table in your DB
export class User {
    @PrimaryGeneratedColumn('uuid')
    ID: string;
  
    @Column({ name: 'LastName',})
    last_name: string;
  
    @Column({ name: 'Name',})
    first_name: string;

    @Column({ name: 'MidName',})
    second_name: string;

    @Column({ name: 'Birthday',})
    birthday: string;
    
    @Column({ name: 'post',})
    post: string;

    @Column({ name: 'DepartmentID', type: 'int'})
    department: number;

    @Column({ name: 'Status',})
    status: string;

    @Column({ name: 'Photo',})
    photo: string;

    @OneToOne(() => Role)
    @JoinColumn({name:"Contacts"})
    role: string;

    @OneToMany(() => Contact, (contact) => contact.employeeID, {eager: true,})
    contacts: Contact[];

  }