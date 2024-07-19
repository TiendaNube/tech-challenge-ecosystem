import { Module } from '@nestjs/common'
import { PayableController } from './payable.controller'
import { PayableService } from './payable.service'

export const payableModuleMetadata = {
  imports: [],
  controllers: [PayableController],
  providers: [PayableService],
  exports: [PayableService],
}

@Module(payableModuleMetadata)
export class PayableModule {}
