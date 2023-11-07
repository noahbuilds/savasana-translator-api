import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '../validators/object.id.validator';
import { LanguageCode } from './schemas/translation.schema';
import { ResourceModified } from '../helpers/ResourceModified';
import { ResourceCreated } from '../helpers/ResourceCreated';

@ApiTags('Translation')
@Controller('translation/api/v1')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('create')
  @ApiExtraModels(ResourceCreated)
  @ApiResponse({
    status: 201,

    schema: {
      $ref: getSchemaPath(ResourceCreated),
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Word already translated',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  create(@Body() createTranslationDto: CreateTranslationDto) {
    return this.translationService.create(createTranslationDto);
  }

  // @Get()
  // findAll() {
  //   return this.translationService.findAll();
  // }

  @Get('translate/:word')
  @ApiQuery({
    name: 'lang',
    required: true,
    enum: Object.keys(LanguageCode),
    schema: {
      type: 'string',
      enum: Object.keys(LanguageCode),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Translation Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  findOne(@Param('word') word: string, @Query('lang') lang: LanguageCode) {
    return this.translationService.findOne(word, lang);
  }

  @Patch('update/:id')
  @ApiExtraModels(ResourceModified)
  @ApiResponse({
    status: 200,

    schema: {
      $ref: getSchemaPath(ResourceModified),
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource Not Found',
  })
  @ApiResponse({
    status: 409,
    description: 'Word already translated',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationService.update(id, updateTranslationDto);
  }

  @Delete('delete/:id')
  @ApiExtraModels(ResourceModified)
  @ApiResponse({
    status: 200,

    schema: {
      $ref: getSchemaPath(ResourceModified),
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.translationService.deleteTranslation(id);
  }
}
