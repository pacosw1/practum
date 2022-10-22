import { Entry, Output } from '@prisma/client';
import { IsArray, isArray, IsInt, IsNumberString, IsString } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  public name: string;

  @IsNumberString()
  public areaId: number;

  @IsNumberString()
  public groupId: number;

  @IsArray()
  public newEntries: [Entry]

  @IsArray()
  public existingEntries: [number]

  @IsArray()
  public newOutputs: [Output]

  @IsArray()
  public existingOutputs: [number]

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
