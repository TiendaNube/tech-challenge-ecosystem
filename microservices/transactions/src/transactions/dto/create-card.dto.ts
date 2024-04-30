import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsNumberString()
  number: string;

  @ApiProperty({
    example: '12/2028',
  })
  @IsNotEmpty()
  @IsString()
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
