import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, author: User): Promise<Blog> {
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      author,
    });
    await createdBlog.save();
    return this.findById(createdBlog._id.toString());
  }

  async findAll(query: any = {}) {
    const { limit = 10, offset = 0, category, author } = query;
    const filter: any = {};

    if (category) filter.category = category;
    if (author) filter.author = author;
    
    return this.blogModel
      .find(filter)
      .populate('author', 'username email avatar')
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(id: string) {
    return this.blogModel.findById(id).exec();
  }

  async findById(id: string): Promise<Blog> {
    const blog = await this.blogModel
      .findById(id)
      .populate('author', 'username email avatar')
      .populate('likes', 'username')
      .exec();
    
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, userId: string): Promise<Blog> {
    const blog = await this.blogModel.findOneAndUpdate(
      { _id: id, author: userId }, 
      updateBlogDto, 
      { new: true })
      .exec();
    
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    
    return blog;
  }

  async remove(id: string, userId: string) {
    const result = await this.blogModel.deleteOne({ _id: id, author: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Blog not found');
    }
  }

  async likePost(postId: string, userId: string): Promise<Blog> {
    const blog = await this.blogModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).exec();
    
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    
    return blog;
  }

  async searchPosts(query: string): Promise<Blog[]> {
    return this.blogModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
  }
}
