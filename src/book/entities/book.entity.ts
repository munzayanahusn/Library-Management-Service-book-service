import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID, IsString, IsDateString } from 'class-validator';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsUUID()
  authorId: string;

  @Column('date')
  @IsDateString()
  publishedDate: string;

  @Column()
  @IsString()
  isbn: string;
}
