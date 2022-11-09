import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionEntity } from './models/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}
  
  @Post('uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const entities = await this.transactionService.parseCSVToEntites(file);
    
    await TransactionEntity.save(entities);  
    
    return entities;
  }

  @Get()
  async getReport() {
    return this.transactionService.getReports();
  }

}
