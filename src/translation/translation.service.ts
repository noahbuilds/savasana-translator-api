import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LanguageCode, Translation } from './schemas/translation.schema';
import { Trimmer } from '../helpers/Trimmer';
import { ResourceCreated } from '../helpers/ResourceCreated';
import { ResourceModified } from '../helpers/ResourceModified';

@Injectable()
export class TranslationService {
  constructor(
    @InjectModel(Translation.name) private translationModel: Model<Translation>,
  ) {}

  create = async (
    createTranslationDto: CreateTranslationDto,
  ): Promise<ResourceCreated> => {
    const foundWordWithTranslation = await this.translationModel.findOne({
      word: Trimmer(createTranslationDto.word),
      language_code: Trimmer(createTranslationDto.language_code),
    });
    if (foundWordWithTranslation) {
      throw new HttpException('Word already translated', HttpStatus.CONFLICT);
    }

    const result = await this.translationModel.create(createTranslationDto);
    if (result.errors) {
      const validationErrors = Object.values(result.errors).map(
        (error: any) => error.message,
      );
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }

    return new ResourceCreated(result.id);
  };

  findAll = async () => {
    return await this.translationModel.find();
  };

  findOne = async (word: string, lang: LanguageCode): Promise<Translation> => {
    if (!lang) {
      throw new HttpException(
        'Language is required as a query params',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!word) {
      throw new HttpException('Word is required', HttpStatus.BAD_REQUEST);
    }
    const translation = await this.translationModel.findOne({
      word: Trimmer(word),
      language_code: Trimmer(lang),
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }
    return translation;
  };

  update = async (
    id: string,
    updateTranslationDto: UpdateTranslationDto,
  ): Promise<ResourceModified> => {
    const foundTranslation = await this.translationModel.findById(id);
    if (!foundTranslation) {
      throw new HttpException('Resource not Found', HttpStatus.NOT_FOUND);
    }

    // Check if the word in the update DTO is the same as the existing word.
    if (updateTranslationDto.word !== foundTranslation.word) {
      // Word is different, so check if another word exists with the same language code.
      const existingWordWithTranslation = await this.translationModel.findOne({
        word: Trimmer(updateTranslationDto.word),
        language_code: Trimmer(updateTranslationDto.language_code),
      });

      if (existingWordWithTranslation) {
        // Another word exists in the same language code.
        throw new HttpException('Word already translated', HttpStatus.CONFLICT);
      }
    }

    // If word is the same or no conflict, proceed with the update.
    const updateData = {
      word: Trimmer(updateTranslationDto.word),
      language_code: Trimmer(updateTranslationDto.language_code),
      translation: updateTranslationDto.translation,
    };

    const updatedTranslation = await this.translationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedTranslation) {
      throw new HttpException(
        'Update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return new ResourceModified(updatedTranslation.id);
  };

  deleteTranslation = async (id: string): Promise<ResourceModified> => {
    const foundTranslation = await this.translationModel.findById(id);
    if (!foundTranslation) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }
    const deletedTranslation = await this.translationModel.findByIdAndDelete(
      id,
    );
    return new ResourceModified(deletedTranslation.id);
  };
}
