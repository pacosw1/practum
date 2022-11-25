import { IsEmail, IsString, IsNumber } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  public name: string;

  @IsNumber()
  public order: number;
}
