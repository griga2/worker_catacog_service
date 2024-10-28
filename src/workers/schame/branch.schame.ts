import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

class Schedule {

  @Prop()
  startWork : Date
  
  @Prop()
  finishWork : Date

  @Prop()
  startWorkSunday : Date

  @Prop()
  finishWorkSunday : Date

  @Prop()
  startWorkSatyrday : Date

  @Prop()
  finishWorkSatyrday : Date

  @Prop()
  startWorkHolyday : Date

  @Prop()
  finishWorkHolyday : Date
}


@Schema()
export class Branch {
  @Prop()
  name: string;

  @Prop()
  phone:string;

  @Prop()
  adres:string;

  @Prop()
  childred: Array<mongoose.Types.ObjectId>

  @Prop()
  schedule: Schedule
}


export const BranchSchema = SchemaFactory.createForClass(Branch);