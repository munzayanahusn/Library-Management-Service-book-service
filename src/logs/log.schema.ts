import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Log extends Document {
  @Prop()
  operation: string;

  @Prop()
  entity: string;

  @Prop()
  entityId: string;

  @Prop()
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);