import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockBookRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('BookService', () => {
  let service: BookService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useFactory: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{ id: 'uuid', title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result as Book[]);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = { id: 'uuid', title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result as Book);
      expect(await service.findOne('uuid')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const book = { title: 'Test Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      const result = { id: 'uuid', ...book };
      jest.spyOn(repository, 'save').mockResolvedValue(result as Book);
      expect(await service.create(book as Book)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const book = { title: 'Updated Book' };
      const result = { id: 'uuid', title: 'Updated Book', authorId: 'uuid', publishedDate: '2020-01-01', isbn: '1234567890' };
      jest.spyOn(repository, 'update').mockResolvedValue(result as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(result as Book);
      expect(await service.update('uuid', book)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should delete an existing book', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove('uuid')).resolves.toBeUndefined();
    });
  });
});
