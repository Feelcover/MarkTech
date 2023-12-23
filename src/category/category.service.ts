import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(id: number, dto: CategoryDto) {
    return this.prismaService.category.update({
      where: {
        id
      },
      data: {
        name: '',
        slug: ''
      }
    });
  }

  async byId(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async bySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async update(id: number, dto: CategoryDto) {
    return this.prismaService.category.update({
      where: {
        id
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name)
      }
    });
  }

  async delete(id: number) {
    return this.prismaService.category.delete({
      where: {
        id
      }
    });
  }
}
