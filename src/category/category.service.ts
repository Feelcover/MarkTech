import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { CategoryDto } from './dto/category.dto';
import { returnCategoryObject } from './return-category.object';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}



  async getAll() {
    return await this.prismaService.category.findMany({
      select: returnCategoryObject
    });
  }

  async byId(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id
      },
      select: returnCategoryObject
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
      select: returnCategoryObject
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async create() {
    return this.prismaService.category.create({
      data: {
        name: '',
        slug: '',
      }
    });
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
