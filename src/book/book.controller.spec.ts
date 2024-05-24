import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockBookRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockLogsService = () => ({
  createLog: jest.fn(),
});

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useFactory: mockBookRepository,
        },
        {
          provide: LogsService,
          useFactory: mockLogsService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{ id: 'uuid', title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as Book[]);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = { id: 'uuid', title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as Book);
      expect(await controller.findOne('uuid')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const book = { title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      const result = { id: 'uuid', ...book };
      jest.spyOn(service, 'create').mockResolvedValue(result as Book);
      expect(await controller.create(book as Book)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const book = { title: 'Updated Book' };
      const result = { id: 'uuid', title: 'Updated Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      jest.spyOn(service, 'update').mockResolvedValue(result as Book);
      expect(await controller.update('uuid', book)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete an existing book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await expect(controller.remove('uuid')).resolves.toBeUndefined();
    });
  });
});
