import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { CsvParser } from 'nest-csv-parser';
import { TransactionEntity } from './models/transaction.entity';
import { ReportQuery, ReportResult } from './models/transaction.types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly csvParser: CsvParser,
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}
  
  @Post('uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);
    const entities = await this.csvParser.parse(stream, TransactionEntity, 0, 0, { separator: ',' } );
    entities.list.forEach(entity => {
      entity.date = entity.date.split('-').reverse().join('-');
    });

    await TransactionEntity.save(entities.list);  
    
    return entities;
  }

  @Get()
  async getReport() {
    const queryReport: ReportQuery[] = await this.transactionRepository.createQueryBuilder('t')
        .select(["to_char(date, 'MM-YYYY') as monyear", 'source', 'SUM(sum)'])
        .addGroupBy('1,2')
        .orderBy('source')
        .getRawMany();

    const results = [] as ReportResult[];

    queryReport.forEach(qr => {
      const foundIndex = results.findIndex(r => r.source === qr.source);
      console.log(foundIndex)
      if (foundIndex >= 0) {
        results[foundIndex].data.push({date: qr.monyear, total: qr.sum});
      } else {
        results.push({source: qr.source, data: [{date: qr.monyear, total: qr.sum}]});
      }
    });

    return results;
  }

}
