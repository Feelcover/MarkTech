import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  
  email: string;

  @MinLength(5, { message: 'Минимальная длина пароля - 5 символов' })
  @MaxLength(30, { message: 'Максимальная длина пароля - 30 символов' })
  @IsString()
  password: string;

  @IsString({ message: 'Введите имя' })
  firstName: string;

  @IsString({ message: 'Введите фамилию' })
  lastName: string;

  @IsOptional()
  @IsString()
  avatarPath: string;

  @IsOptional()
  @IsString()
  phone: string;
}
