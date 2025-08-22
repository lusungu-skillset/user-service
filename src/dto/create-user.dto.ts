import { IsEmail, IsString, IsStrongPassword, IsEnum, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { UserGender } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: 'Username can only contain letters, numbers, and underscores' 
  })
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  userEmail: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, { 
    message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol' 
  })
  userPassword: string;

  @IsOptional()
  @IsEnum(UserGender, { 
    message: 'Gender must be either male, female, or other' 
  })
  gender?: UserGender;
}