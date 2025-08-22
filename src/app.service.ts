import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'userPassword'>> {
    const { userPassword, ...userData } = createUserDto;

    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({ 
      where: { username: userData.username } 
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({ 
      where: { userEmail: userData.userEmail } 
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    try {
      // Hash the password before saving
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

      // Create and save the user
      const user = this.userRepository.create({
        ...userData,
        userPassword: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      // Remove password from the returned object
      const { userPassword: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;

    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new ConflictException('User with this username or email already exists');
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { userEmail },
      select: ['id', 'username', 'userEmail', 'userPassword', 'gender', 'createdAt'] // Include password for auth verification
    });
  }

  async findById(id: string): Promise<Omit<User, 'userPassword'> | null> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'userEmail', 'gender', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}