import { Entry, Output, Tool } from '@prisma/client';
import { IsArray, isArray, IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProcessDto {
  @IsString()
  public name: string;

  @IsNumberString()
  public areaId: number;

  @IsNumberString()
  public groupId: number;

  @IsArray()
  public newEntries: [Entry];

  @IsArray()
  public existingEntries: [number];

  @IsArray()
  public newOutputs: [Output];

  @IsArray()
  public existingOutputs: [number];

  @IsArray()
  public newTools: [Tool];

  @IsArray()
  public existingTools: [number];
}

export class CreateEntryExitDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsOptional()
  @IsBoolean()
  public isExit: boolean;
}

export class GetFilteredProcessesDto {
  @IsNumberString()
  public areaId: number;

  @IsNumberString()
  public groupId: number;
}
