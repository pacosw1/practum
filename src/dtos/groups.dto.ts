import { IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  public name: string;

  @IsOptional()
  @IsInt()
  public order: number;
}
