import {
  BadRequestException,
  Injectable,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { TreeRepository } from 'typeorm';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
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
        this.logger.error(
          `Not found parent with id: ${createLocationDto.parent_id}`,
        );
        throw new NotFoundException('The upper Location not found.');
      }
      location.parent = parentLocation;
    }
    try {
      return await this.locationRepository.save(location);
    } catch (error) {
      this.logger.error(
        `Failed to create location: ${JSON.stringify(createLocationDto)}`,
        error.stack,
      );
      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      return await this.locationRepository.findTrees();
    } catch (error) {
      this.logger.error('Failed to retrieve locations', error.stack);
    }
  }

  async findOne(id: number) {
    return await this.locationRepository.findOne({ where: { id } });
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    // find the location to update
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Not found location with id: ${id}`);
      throw new NotFoundException('Location not found.');
    }

    // check if any changes in parent location
    if (
      updateLocationDto.parent_id &&
      updateLocationDto.parent_id !== location.parent_id
    ) {
      const parentLocation = await this.findOne(updateLocationDto.parent_id);
      if (!parentLocation) {
        this.logger.error(
          `Not found parent with id: ${updateLocationDto.parent_id}`,
        );
        throw new NotFoundException('The upper Location not found.');
      }
      location.parent = parentLocation;
    }

    // update process
    Object.assign(location, updateLocationDto);

    try {
      return await this.locationRepository.save(location);
    } catch (error) {
      this.logger.error(
        `Failed to update location: ${JSON.stringify(updateLocationDto)}`,
        error.stack,
      );
      throw new BadRequestException();
    }
  }

  async remove(id: number) {
    // find the location to delete
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Not found the location with id: ${id}`);
      throw new NotFoundException('Location not found.');
    }

    // check if the location contains children
    const childNo = await this.locationRepository.countDescendants(location);
    if (childNo > 1) {
      this.logger.error(
        `Delete location failed. The location contains children. Location: ${JSON.stringify(location)} `,
      );
      throw new MethodNotAllowedException(
        'The location now contains sub locations.',
      );
    }

    // delete process
    try {
      return await this.locationRepository.remove(location);
    } catch (error) {
      this.logger.error(
        `Failed to delete location: ${JSON.stringify(location)}`,
        error.stack,
      );
      throw new BadRequestException();
    }
  }
}
