import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../dto/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //? User 엔티티를 TypeORM에 등록
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], //? 필요에 따라 다른 모듈에서 UserService를 사용할 수 있게 내보냅니다
})
export class UserModule {}
