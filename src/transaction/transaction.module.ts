import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { TransactionEntity } from './models/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity
    ]),
    CsvModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
