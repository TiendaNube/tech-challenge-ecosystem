import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPastExpirationDate } from 'src/utils/validators/is-past-expiration-date';

export class CreateCardDto {
  @ApiProperty({
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  holder: string;

  @ApiProperty({
    example: '4338',
  })
  @IsNotEmpty()
  @MinLength(12)
  number: number;

  @ApiProperty({
    example: '12/2028',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(IsPastExpirationDate, {
    message: 'Invalid expiration date',
  })
  expirationDate: string;

  @ApiProperty({
    example: '233',
    type: String,
  })
  @MaxLength(3)
  @MinLength(2)
  @IsNumberString()
  @IsNotEmpty()
  cvv: string;
}
