import { Test, TestingModule } from '@nestjs/testing';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { LanguageCode, Translation } from './schemas/translation.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TranslationModule } from './translation.module';

import { AppModule } from '../app.module';

describe('Translation APP', () => {
  let controller: TranslationController;
  let service: TranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationController, TranslationService],
      providers: [
        TranslationService,
        {
          provide: getModelToken(Translation.name),
          useValue: Model,
        },
      ],
      imports: [TranslationModule, AppModule],
    }).compile();

    controller = module.get<TranslationController>(TranslationController);
    service = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /*
  ==================================================================
  Create Translation Endpoint (POST /translation/api/v1/create)
  ================================================================= 
  */
  it('should create a new translation', async () => {
    const createTranslationDto: CreateTranslationDto = {
      word: 'example',
      language_code: LanguageCode.FR,
      translation: 'example translation',
    };

    const result = { id: 'some-id' };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    const response = await controller.create(createTranslationDto);
    expect(response).toEqual(result);
  });

  it('should handle a conflict when word already translated', async () => {
    const createTranslationDto: CreateTranslationDto = {
      word: 'boy',
      language_code: LanguageCode.EN,
      translation: 'translation',
    };

    jest
      .spyOn(service, 'create')
      .mockRejectedValue(
        new HttpException('Word already translated', HttpStatus.CONFLICT),
      );

    await expect(controller.create(createTranslationDto)).rejects.toThrowError(
      'Word already translated',
    );
  });

  it('should handle validation errors', async () => {
    const createTranslationDto: CreateTranslationDto = {
      // Missing required fields
      language_code: LanguageCode.SP,
      translation: '',
      word: 'hello',
    };

    jest
      .spyOn(service, 'create')
      .mockRejectedValue(
        new HttpException('Bad request', HttpStatus.BAD_REQUEST),
      );

    await expect(controller.create(createTranslationDto)).rejects.toThrowError(
      'Bad request',
    );
  });

  /*
  =======================================================================
  Find One Translation Endpoint (GET /translation/api/v1/translate/:word)
  ========================================================================
  */
  it('should find an existing translation', async () => {
    const word = 'existing-word';
    const lang = LanguageCode.EN;
    const result = { word, language_code: lang, translation: 'translation' };
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    const response = await controller.findOne(word, LanguageCode.EN);
    expect(response).toEqual(result);
  });

  it('should handle not found translation', async () => {
    const word = 'non-existing-word';
    const lang = LanguageCode.EN;
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValue(
        new HttpException('Translation not found', HttpStatus.NOT_FOUND),
      );

    await expect(controller.findOne(word, lang)).rejects.toThrowError(
      'Translation not found',
    );
  });

  /*
  ===============================================================
  Update Translation Endpoint (PATCH /translation/api/v1/update/:id)
  ====================================================================
  */
  it('should update a translation', async () => {
    const id = 'some-id';
    const updateTranslationDto = {
      word: 'updated-word',
      language_code: LanguageCode.EN,
      translation: 'updated translation',
    };
    const result = { id };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    const response = await controller.update(id, updateTranslationDto);
    expect(response).toEqual(result);
  });

  it('should handle not found translation for update', async () => {
    const id = 'non-existing-id';
    const updateTranslationDto = {
      word: 'updated-word',
      language_code: LanguageCode.FR,
      translation: 'updated translation',
    };
    jest
      .spyOn(service, 'update')
      .mockRejectedValue(
        new HttpException('Resource Not Found', HttpStatus.NOT_FOUND),
      );

    await expect(
      controller.update(id, updateTranslationDto),
    ).rejects.toThrowError('Resource Not Found');
  });

  /*
  =====================================================================
  Delete Translation Endpoint (DELETE /translation/api/v1/delete/:id)
  =====================================================================
  */

  it('should delete a translation', async () => {
    const id = 'some-id';
    const result = { id };
    jest.spyOn(service, 'deleteTranslation').mockResolvedValue(result);

    const response = await controller.remove(id);
    expect(response).toEqual(result);
  });

  it('should handle not found translation for deletion', async () => {
    const id = 'non-existing-id';
    jest
      .spyOn(service, 'deleteTranslation')
      .mockRejectedValue(
        new HttpException('Resource not found', HttpStatus.NOT_FOUND),
      );

    await expect(controller.remove(id)).rejects.toThrowError(
      'Resource not found',
    );
  });
});
