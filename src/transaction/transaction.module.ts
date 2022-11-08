import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { TransactionEntity } from './models/transaction.entity';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity
    ]),
    CsvModule
  ],
  controllers: [TransactionController]
})
export class TransactionModule {}
