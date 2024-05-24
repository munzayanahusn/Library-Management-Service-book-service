import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { validate } from 'class-validator';

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
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(book: Book): Promise<Book> {
    const errors = await validate(book);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return this.bookRepository.save(book);
  }

  async update(id: string, book: Partial<Book>): Promise<Book> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const errors = await validate(book);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    await this.bookRepository.update(id, book);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
