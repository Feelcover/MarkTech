import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email:string

    @MinLength(5, {message: "Минимальная длина пароля - 5 символов"})
    @MaxLength(30, {message: "Максимальная длина пароля - 30 символов"})
    @IsString()
    password: string

    @MinLength(2, {message: "Минимальная длина имени - 2 символов"})
    name:string

    
}
