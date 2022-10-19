import { IsInt, IsNumberString, IsString } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  public name: string;

  @IsNumberString()
  public areaId: number;

  @IsNumberString()
  public groupId: number;
}

export class CreateEntryExitDto {

  @IsString()
  public name: string;

  @IsString()
  public description: string;

}

export class GetFilteredProcessesDto {
  @IsNumberString()
  public areaId: number;

  @IsNumberString()
  public groupId: number;
}
