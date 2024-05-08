import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { TreeRepository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: TreeRepository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const location = this.locationRepository.create(createLocationDto);

    // check and assign parent location to new object
    if (createLocationDto.parent_id) {
      const parentLocation = await this.findOne(createLocationDto.parent_id);
      if (!parentLocation) {
        throw new NotFoundException('The upper Location not found.');
      }
      location.parent = parentLocation;
    }

    return await this.locationRepository.save(location);
  }

  async findAll() {
    return await this.locationRepository.findTrees();
  }

  async findOne(id: number) {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    // find the location to update
    const location = await this.findOne(id);
    if (!location) {
      throw new NotFoundException('Location not found.');
    }

    // check if any changes in parent location
    if (
      updateLocationDto.parent_id &&
      updateLocationDto.parent_id !== location.parent_id
    ) {
      const parentLocation = await this.findOne(updateLocationDto.parent_id);
      if (!parentLocation) {
        throw new NotFoundException('The upper Location not found.');
      }
      location.parent = parentLocation;
    }

    Object.assign(location, updateLocationDto);
    return await this.locationRepository.save(location);
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
