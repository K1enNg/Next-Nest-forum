import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { UserModule } from '../user/user.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), 
  UserModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
