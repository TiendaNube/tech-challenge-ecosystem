import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsValidDocument } from 'src/utils/validators/is-valid-document.validator';
import { toNumberTransformer } from 'src/utils/validators/transformers/to-number.transformer';

export class CreateMerchantDto {
  @ApiProperty({ example: 1 })
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '111223334455' })
  @IsNotEmpty()
  @Transform(toNumberTransformer)
  @Validate(IsValidDocument, ['documentId'], {
    message: 'O número do documento está inválido.',
  })
  documentId: string;
}
