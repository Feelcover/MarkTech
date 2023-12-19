import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: AuthRegisterDto) {
    const oldUserEmail = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if (oldUserEmail) throw new BadRequestException('Email уже зарегистрирован');
    const oldUserPhone = await this.prismaService.user.findUnique({
      where: {
        phone: dto.phone
      }
    });
    if (oldUserPhone) throw new BadRequestException('Мобильный номер уже зарегистрирован');

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatarPath: dto.avatarPath,
        phone: dto.phone
      }
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  async login(dto: AuthLoginDto) {
    const user = await this.findUser(dto);
    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  private async issueTokens(userId: Number) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h'
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d'
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: Partial<User>) {
    return {
      id: user.id,
      email: user.email
    };
  }

  async getNewToken(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid Refresh Token');

    const user = await this.prismaService.user.findUnique({
      where: {
        id: result.id
      }
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens
    };
  }

  private async findUser(dto: AuthLoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if (!user) throw new BadRequestException('Пользователь не найден');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Неверный пароль');

    return user;
  }
}
