import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //>> 유저 생성
  @Post()
  async createUser(@Body() body: { name: string; phoneNumber: string }) {
    return this.userService.createUser(body.name, body.phoneNumber);
  }

  //>> 모든 유저 조회
  @Get()
  async findAllUsers() {
    return this.userService.findAll();
  }

  //>> 로그인 기능
  @Post('login')
  async login(@Body() body: { phoneNumber: string }) {
    return this.userService.login(body.phoneNumber);
  }

  @Get(':phoneNumber')
  async getUserByPhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.userService.findUserByPhoneNumber(phoneNumber);
  }
}
