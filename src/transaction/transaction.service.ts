import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';
import { Repository } from 'typeorm';
import { TransactionEntity } from './models/transaction.entity';
import { ReportData, ReportResult } from './models/transaction.types';

@Injectable()
export class TransactionService {
  constructor(
    private readonly csvParser: CsvParser,    
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
  ){}

  async parseCSVToEntites(file: Express.Multer.File) {
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);
    const entities = await this.csvParser.parse(stream, TransactionEntity, 0, 0, { separator: ',' } );
    entities.list.forEach(entity => {
      entity.date = entity.date.split('-').reverse().join('-');
    });

    return entities.list;
  }  

  async getReports(){
    const queryReport = await this.getReportData();
    return this.transformReport(queryReport);
  }

  private async getReportData(): Promise<ReportData[]> {
    const queryReport: ReportData[] = await this.transactionRepository.createQueryBuilder('t')
        .select(["to_char(date, 'MM-YYYY') as monyear", 'source', 'SUM(sum)'])
        .addGroupBy('1,2')
        .orderBy('source')
        .getRawMany();
    
    return queryReport;
  }

  private transformReport(reportData: ReportData[]): ReportResult[] {
    const results = [] as ReportResult[];

    reportData.forEach(qr => {
      const foundIndex = results.findIndex(r => r.source === qr.source);
      if (foundIndex >= 0) {
        results[foundIndex].data.push({date: qr.monyear, total: qr.sum});
      } else {
        results.push({source: qr.source, data: [{date: qr.monyear, total: qr.sum}]});
      }
    });

    return results;
  }
}
