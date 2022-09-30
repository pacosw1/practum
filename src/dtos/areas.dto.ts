import { IsEmail, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  public name: string;
}
