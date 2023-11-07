import { ApiProperty } from '@nestjs/swagger';
import { LanguageCode } from '../schemas/translation.schema';

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTranslationDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  word: string;
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  translation: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  language_code: LanguageCode;
}
