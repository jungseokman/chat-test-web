import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dto/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //>> 유저 생성
  async createUser(name: string, phoneNumber: string): Promise<User> {
    //> 이미 존재하는 유저인지 확인

    console.log(phoneNumber);

    const existingUser = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    //> 유저 생성
    const user = this.userRepository.create({ name, phoneNumber });
    return this.userRepository.save(user);
  }

  //>> 모든 유저 조회
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //> 로그인 기능 (전화번호로 유저 확인)
  async login(phoneNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }
}
