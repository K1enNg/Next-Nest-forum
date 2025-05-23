import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ 
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already in use');
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already taken');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(query: any = {}) {
    const { limit = 10, offset = 0, ...filter } = query;
    return this.userModel
      .find(filter)
      .select('-password')
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findOne(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async remove(_id: string) {
    return this.userModel.findByIdAndDelete(_id).exec();
  }
}
