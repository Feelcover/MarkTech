import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthDto{
@IsEmail()
email: string

@MinLength(5, {message: "Минимальная длина - 5 символов"})
@IsString()
password: string

}