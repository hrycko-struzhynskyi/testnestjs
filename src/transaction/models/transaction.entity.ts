import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transactions')
export class TransactionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'date',
      name: 'date'
    })
    date: Date;

    @Column({
      type: 'integer',
      name: 'sum'
    })
    sum: number;

    @Column({
      type: 'varchar',
      name: 'source'
    })
    source: string;

    @Column({
      type: 'text',
      nullable: true
    })
    description: string;

}