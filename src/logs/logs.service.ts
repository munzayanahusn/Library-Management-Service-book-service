import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async createLog(operation: string, entity: string, entityId: string): Promise<Log> {
    const newLog = new this.logModel({ operation, entity, entityId, timestamp: new Date() });
    return newLog.save();
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().exec();
  }
}
