import { ModuleMetadata } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { databaseTestOptions } from '../../test/test.database.options'

export function toCurrency(value: number): number {
  /** improve this implementation */
  return Number(value.toFixed(2))
}

export const createModuleForUnitTest = async (metadata: ModuleMetadata) : Promise<TestingModule> => Test.createTestingModule(metadata).compile()

export const createModuleForIntegrationTest = async (metadata: ModuleMetadata) : Promise<TestingModule> => {
  const typeOrmOptions = { ...databaseTestOptions } as TypeOrmModuleOptions
  metadata.imports!.push(TypeOrmModule.forRoot(typeOrmOptions))
  return Test.createTestingModule(metadata).compile()
}

export const defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss'
