import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from './Employers.entity';

@Entity('Departments') //This maps the notes entity to the 'notes' table in your DB
export class Department {
    @PrimaryGeneratedColumn({name:'ID'})
    id?: string;
  
    @Column({ name: 'Name',})
    name?: string;

    @Column({ name: 'ChiefID',})
    chief_id?: string;

    @Column({ name: 'Address',})
    address?: string;

    @Column({ name: 'FatherID',})
    father_id?: string;

    @Column({ name: 'MonFriday',})
    monFriday?: boolean;

    @Column({ name: 'Saturday',})
    saturday?: boolean;

    @Column({ name: 'Sunday',})
    sunday?: boolean;

    @Column({ name: 'MonFidayOpenning',})
    monFridayOpenning?: Date;

    @Column({ name: 'MonFridayClosing',})
    monFridayClosing?: Date;

    @Column({ name: 'SaturdayOpenning',})
    saturdayOpenning?: Date;

    @Column({ name: 'SaturdayClosing',})
    saturdayClosing?: Date;

    @Column({ name: 'SundayOpenning',})
    sundayOpenning?: Date;

    @Column({ name: 'SundayClosing',})
    sundayClosing?: Date;

    @Column({name: "OrderNum",})
    orderNum?: string;

    @Column({name: "TimeOffset",})
    timeOffset?: string;

    @Column({name: "Email",})
    email?: string;

    @Column({name: "Time_Ping",})
    time_ping?: number;

    @Column({name: "City",})
    сity?: string;

    @Column({name: "CFO_Vest",})
    cfo_vest?: string;

    @Column({name: "SQL_SERVER_Vesta",})
    sql_server_vesta?: string;

    @Column({name: "Database_Vesta",})
    database_vesta?: string;

    @Column({name: "ID_Vesta",})
    id_vesta?: string;

    @Column({name: "OID",})
    oid?: string;

    @Column({name: "isOfficeDepartment",})
    isOfficeDepartment?: number;

    @Column({name: "isOfficePurchase",})
    isOfficePurchase?: number;
    
    @Column({name: "isStorage",})
    isStorage?: number;
}
