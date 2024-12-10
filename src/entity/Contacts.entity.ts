import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './Users.entity';

@Entity('Roles') //This maps the notes entity to the 'notes' table in your DB
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    ID: string;
  
    @ManyToOne(() => User, (user) => user.contacts, )
    employeeID: User;
  
    @Column({ name: 'Name',})
    type: string;

    @Column({ name: 'Name',})
    name: string;

  }