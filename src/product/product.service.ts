import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';
import { productReturnObjectFullest } from './return-product.object';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private paginationService: PaginationService,
    private categoryService: CategoryService
  ) {}

  async create() {
    const product = await this.prismaService.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: ''
      }
    });
    return product.id;
  }

  async byId(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id
      },
      select: productReturnObjectFullest
    });

    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        slug
      },
      select: productReturnObjectFullest
    });

    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          slug: categorySlug
        }
      },
      select: productReturnObjectFullest
    });

    if (!products) throw new NotFoundException('Products not found!');
    return products;
  }

  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    await this.categoryService.byId(categoryId);
  }
}
