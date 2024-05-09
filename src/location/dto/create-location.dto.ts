import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @Length(1, 20)
  @ApiProperty()
  building: string;

  @IsNotEmpty()
  @Length(3, 60)
  @ApiProperty()
  location_name: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  location_number: string;

  @IsNotEmpty()
  @Length(3, 20)
  @ApiProperty()
  area: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  parent_id: number;
}
