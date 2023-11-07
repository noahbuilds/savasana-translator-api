import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Translation {
  @Prop({ required: true })
  word: string;

  @Prop({ required: true })
  translation: string;

  @Prop({ required: true })
  language_code: LanguageCode;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);

export enum LanguageCode {
  EN = 'english',
  FR = 'french',
  SP = 'spanish',
}
