import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from './Employers.entity';

@Entity('Roles') //This maps the notes entity to the 'notes' table in your DB
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'Name',})
    name: string;  

    @Column({name: "Index"})
    index: number;
  }