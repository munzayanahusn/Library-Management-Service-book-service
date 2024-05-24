import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MongooseConfigModule } from './mongoose/mongoose.module';
import { BookModule } from './book/book.module';
import { LogsModule } from './logs/logs.module';
import { Book } from './book/entities/book.entity';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Book],
      synchronize: true,
    }),
    
    MongooseModule.forRoot(process.env.MONGODB_URI),
    BookModule,
    LogsModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})

export class AppModule {}