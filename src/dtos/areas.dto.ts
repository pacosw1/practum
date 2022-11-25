import { IsEmail, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  public name: string;

  @IsOptional()
  @IsInt()
  public order: number;
}
