import { Controller, Get, Delete, Query, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0
  ) {
    return this.userService.findAll({ limit, offset });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
