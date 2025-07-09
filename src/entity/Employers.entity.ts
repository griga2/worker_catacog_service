import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './Roles.entity';
import { Contact } from './Contacts.entity';
import { Department } from './Departments.entity';
import { bool } from 'aws-sdk/clients/signer';

@Entity('Employees') //This maps the notes entity to the 'notes' table in your DB
export class Employer {
    @PrimaryGeneratedColumn('uuid',{name: "ID"})
    id?: string;
  
    @Column({ name: 'LastName',})
    last_name?: string;
  
    @Column({ name: 'Name',})
    first_name?: string;

    @Column({ name: 'MidName',})
    second_name?: string;

    @Column({ name: 'Birthday',})
    birthday?: string;

    @Column({ name: 'Status',})
    status?: string;

    @Column({ name: 'Photo',})
    photo?: string;

    @Column({ name: 'EmploymentDate',})
    employment_date?: string;

    @Column({ name: 'Dismissed',})
    dismissed?: string;

    @Column({ name: 'DismissionDate',})
    dismission_date?: string;

    @Column({ name: 'Sex',})
    sex?: string;

    @Column({ name: 'City',})
    city?: string;

    @Column({ name: 'Login',})
    login?: string;

    @Column({ name: 'Bio',})
    bio?: string;

    @Column({ name: "OnLeave"})
    onLeave?: boolean;

    @Column({ name: "Role"})
    role?: string;

    @Column({ name: "LeaveText"})
    leave_text?: string;

    @Column({ name: "LeaveStart"})
    leave_start?: string;

     @Column({ name: "LeaveFinish"})
    leave_finish?: string;
}