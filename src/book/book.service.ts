import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  create(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  async update(id: string, book: Book): Promise<Book> {
    await this.bookRepository.update(id, book);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}