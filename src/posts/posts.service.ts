import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  // title. content, authorId
  async create(post: CreatePostDto) {
    const userFound = await this.usersService.findOne(post.authorId);
    if (!userFound)
      return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const newPost = this.postsRepository.create(post);
    return this.postsRepository.save(newPost);
  }

  findAll() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }
}
