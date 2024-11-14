import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../dto/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(sender: string, content: string): Promise<Message> {
    const message = this.messageRepository.create({ sender, content });
    return this.messageRepository.save(message);
  }

  async getMessages(): Promise<Message[]> {
    return this.messageRepository.find({ order: { createdAt: 'ASC' } });
  }
}
