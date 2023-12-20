import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'argon2';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async profile(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarPath: true,
        password: false,
        phone: true,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true
          }
        },
        ...selectObject
      }
    });
    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    const isSameUser = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (isSameUser && id !== isSameUser.id) {
      throw new BadRequestException('Email уже зарегистрирован');
    }

    const user = await this.profile(id);

    return this.prismaService.user.update({
      where: {
        id
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password
      }
    });
  }

  async toggleFavorite(id: number, productId: number) {
    const user = await this.profile(id);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const isExist = user.favorites.some((product) => product.id === productId);

    await this.prismaService.user.update({
        where:{
            id:user.id
        },
        data:{
            favorites:{
                [isExist ? 'disconnect' : 'connect'] : {
                    id:productId
                }
            }
        }
    })
    return "Success"
}
}
