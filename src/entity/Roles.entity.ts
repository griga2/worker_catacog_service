import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Roles') //This maps the notes entity to the 'notes' table in your DB
export class Role {
    @PrimaryGeneratedColumn('uuid')
    ID: string;
  
    @Column({ name: 'Name',})
    name: string;
  
  }