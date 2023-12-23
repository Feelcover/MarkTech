import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	firstName: true,
	lastName: true,
	avatarPath: true,
	password: false,
	phone: true
}
