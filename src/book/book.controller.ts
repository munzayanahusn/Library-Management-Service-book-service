import { Body, Controller, Get, Patch, Post, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { LogsService } from '../logs/logs.service';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly logsService: LogsService
  ) {}

  @ApiOperation({ summary: 'Get all books' })
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', required: true })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  @ApiOperation({ summary: 'Create a book' })
  @ApiBody({ type: Book })
  @Post()
  async create(@Body() book: Book) {
    const createdBook = await this.bookService.create(book);
    await this.logsService.createLog('create', 'book', createdBook.id);
    return createdBook;
  }

  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: Book })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() book: Partial<Book>) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const updatedBook = await this.bookService.update(id, book);
    await this.logsService.createLog('update', 'book', updatedBook.id);
    return updatedBook;
  }

  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', required: true })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    await this.bookService.remove(id);
    await this.logsService.createLog('delete', 'book', id);
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
