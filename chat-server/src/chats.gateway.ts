import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './repository/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private users: number = 0;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    this.users++;
    this.server.emit('users', this.users);
    console.log(`A user connected. Total users: ${this.users}`);
  }

  handleDisconnect(client: Socket) {
    this.users--;
    this.server.emit('users', this.users);
    console.log(`A user disconnected. Total users: ${this.users}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { sender: string; content: string },
  ) {
    // 메시지를 데이터베이스에 저장
    try {
      const savedMessage = await this.messageService.saveMessage(
        payload.sender,
        payload.content,
      );
      console.log('Message saved successfully:', savedMessage);

      // 모든 클라이언트에게 메시지 브로드캐스트
      this.server.emit('message', payload);
      console.log('Broadcasting message to all clients:', payload);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }
}
