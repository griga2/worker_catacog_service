import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Departments') //This maps the notes entity to the 'notes' table in your DB
export class Department {
    @PrimaryGeneratedColumn({name:'ID'})
    id: string;
  
    @Column({ name: 'Name',})
    name: string;
  
    @Column({ name: 'ChiefID',})
    chief_id: string;

    @Column({ name: 'Address',})
    address: string;

    @Column({ name: 'FatherID',})
    father_id: string;

    @Column({ name: 'WorkingDays',})
    working_days: string;

    @Column({ name: 'OpeningHours',})
    opening_hours: string;

    @Column({ name: 'OpeningHours',})
    MonFriday: boolean;

    @Column({ name: 'Saturday',})
    Saturday: boolean;

    @Column({ name: 'Sunday',})
    Sunday: boolean;

    @Column({ name: 'OpeningHours',})
    MonFidayOpenning: boolean;

    @Column({ name: 'Saturday',})
    MonFridayClosing: boolean;

    @Column({ name: 'Sunday',})
    SaturdayOpenning: boolean;

    @Column({ name: 'OpeningHours',})
    SaturdayClosing: boolean;

    @Column({ name: 'Saturday',})
    SundayOpenning: boolean;

    @Column({ name: 'Sunday',})
    SundayClosing: boolean;
  }
