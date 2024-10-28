import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Departments') //This maps the notes entity to the 'notes' table in your DB
export class Departments {
    @PrimaryGeneratedColumn({name:'ID'})
    id: string;
  
    @Column({ name: 'Name',})
    name: string;
  
    @Column({ name: 'ChiefID',})
    chief_id: string;

    @Column({ name: 'Address',})
    adress: string;

    @Column({ name: 'FatherID',})
    father_id: string;

  }
