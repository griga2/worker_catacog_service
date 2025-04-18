import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from './Employers.entity';

@Entity('Contacts') //This maps the notes entity to the 'notes' table in your DB
export class Contact {
    @PrimaryGeneratedColumn('uuid',{name: 'ID'})
    ID?: string;
  
    @Column({ name: 'Type',})
    Type: string;

    @Column({ name: 'Value',})
    Value: string;

    @Column({name: 'IsMain'})
    IsMain?: boolean;

    @Column({name:'EmployeeID'})
    EmployeeID: string;
  }