import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  register(dto: AuthDto) {
    const oldUser = this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if (oldUser) throw new BadRequestException('Пользователь уже существует');
    return;
  }
}
