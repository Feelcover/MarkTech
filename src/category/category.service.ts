import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prismaService: PrismaService) {}

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
		})

		if (!category) {
			throw new NotFoundException('Категория не найдена')
		}

		return category
	}
}
