import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmpoyerDocument = HydratedDocument<Empoyer>;

@Schema()
export class Empoyer {
  @Prop()
  name: string;

  @Prop()
  company: string;

  @Prop()
  phone:string;

  @Prop()
  mail:string;

  @Prop()
  also_contact: Array<string>;

  @Prop()
  funcshion: Array<string>;
  
  @Prop()
  file_path: string;

  @Prop()
  work: string;
}

export const EmpoyerSchema = SchemaFactory.createForClass(Empoyer);