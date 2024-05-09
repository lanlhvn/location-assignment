import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @Length(1, 20)
  building: string;

  @IsNotEmpty()
  @Length(3, 60)
  location_name: string;

  @IsNotEmpty()
  @Length(3, 20)
  location_number: string;

  @IsNotEmpty()
  @Length(3, 20)
  area: string;

  @IsOptional()
  @IsNumber()
  parent_id: number;
}
