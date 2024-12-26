import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async create(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async update(id: string, user: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userFound, user);
    // this.userRepository.update({ id }, user);
    return this.userRepository.save(updatedUser);
  }

  async remove(id: string) {
    const result = await this.userRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async createProfile(id: string, profile: CreateProfileDto) {
    // buscamos el ususario a relacionar
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userFound) {
      return new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }

    // creamos un perfil nuevo
    const newProfile = this.profileRepository.create(profile);
    // guardamos el perfil
    const savedProfile = await this.profileRepository.save(newProfile);
    // lo asignamos al usuario encontrado
    userFound.profile = savedProfile;

    return this.userRepository.save(userFound);
  }
}
