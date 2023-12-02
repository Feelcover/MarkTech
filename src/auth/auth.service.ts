import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {

register(){
    return {name:'vasya'}
}
}
