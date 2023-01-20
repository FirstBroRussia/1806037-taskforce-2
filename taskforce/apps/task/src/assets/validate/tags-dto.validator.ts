import { BadRequestException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { TagsValidationValueEnum } from '../constant/constants';

@ValidatorConstraint()
export class TagsValidator implements ValidatorConstraintInterface {
  validate(tags: string[]) {
    if (tags.length > TagsValidationValueEnum.MaxTagsCount) {
      throw new BadRequestException('No more than 5 tags');
    }

    tags = Array.from(new Set(tags));
    tags.forEach(item => {
      if (item.length < TagsValidationValueEnum.MinTagLength || item.length > TagsValidationValueEnum.MaxTagLength) {
        throw new BadRequestException(`The tag length must be at least 3 characters and no more than 10 characters. Target tag: ${item}`);
      }
      if (!(/^[a-zA-Zа-яА-Я]$/).test(item.substr(0, 1))) {
        throw new BadRequestException(`The tag must start with the letter. Target tag: ${item}`);
      }
    })

    return true;
  }

}
