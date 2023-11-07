import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Word extends Document {
  @Prop({ required: true })
  sourceLanguage: string;

  @Prop({ required: true })
  originalWord: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
