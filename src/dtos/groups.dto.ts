import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  public name: string;

  @IsNumber()
  public order: number;
}
