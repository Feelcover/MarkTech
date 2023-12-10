import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  jwtService: any;
  constructor(private prismaService: PrismaService, jwtService: JwtService) {}

  private async issueToken(userId: Number) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h'
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d'
    });

    return { accessToken, refreshToken };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if (oldUser) throw new BadRequestException('Пользователь уже существует');

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        password: await hash(dto.password),
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone
      }
    });
    return user;
  }
}
