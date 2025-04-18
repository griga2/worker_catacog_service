import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from './Employers.entity';

@Entity('Photo') //This maps the notes entity to the 'notes' table in your DB
export class Photo {
    @Column({name: 'EmployerID'})
    employerId?: string;

   

    @PrimaryGeneratedColumn({name:'ID'})
    id?: string;
}