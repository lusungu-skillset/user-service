import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './app.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('USER_CREATE')
  async createUser(@Payload() data: CreateUserDto) {
    try {
      const user = await this.userService.create(data);
      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern('USER_FIND_BY_EMAIL')
  async findByEmail(@Payload() data: { userEmail: string }) {
    try {
      const user = await this.userService.findByEmail(data.userEmail);
      return {
        success: true,
        data: user,
        exists: !!user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern('USER_FIND_BY_ID')
  async findById(@Payload() data: { id: string }) {
    try {
      const user = await this.userService.findById(data.id);
      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }

  @MessagePattern('USER_VALIDATE_PASSWORD')
  async validatePassword(@Payload() data: { plainPassword: string, hashedPassword: string }) {
    try {
      const isValid = await this.userService.validatePassword(data.plainPassword, data.hashedPassword);
      return {
        success: true,
        isValid
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        statusCode: error.status || 500
      };
    }
  }
}