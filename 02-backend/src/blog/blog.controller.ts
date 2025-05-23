import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.blogService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req,
  ) {
    return this.blogService.update(id, updateBlogDto, req.user._id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.blogService.remove(id, req.user._id);
  }
}
