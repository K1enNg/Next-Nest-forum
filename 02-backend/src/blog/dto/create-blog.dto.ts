import { IsString, IsNotEmpty, IsIn, MaxLength, IsArray, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsIn(['technology', 'psychology', 'philosophy', 'history'])
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}