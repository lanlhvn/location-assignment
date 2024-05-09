import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@Controller('location')
export class LocationController {
  private readonly logger = new Logger(LocationController.name);
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ description: 'This API is for create a new location.' })
  @ApiBody({
    type: CreateLocationDto,
    description: 'CreateLocationDto',
    examples: {
      a: {
        summary: 'Empty Body',
        description:
          'Create a new location with information in the CreateLocationDto',
        value: {
          building: 'A',
          location_name: 'Lobby',
          location_number: 'A-01',
          area: '18.000 m2',
        } as CreateLocationDto,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Location created successfully',
    schema: {
      type: 'json',
      example: {
        id: 123,
        building: 'A',
        location_name: 'Lobby',
        location_number: 'A-01',
        area: '18.000 m2',
        parent_id: 1,
        children: [],
        created_date: '2024-05-09T00:50:30.731Z',
        updated_date: '2024-05-09T00:50:30.731Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No parent location found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An exception occurred during saving location.',
  })
  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    this.logger.verbose(
      `Creating a new location. Body: ${JSON.stringify(createLocationDto)}`,
    );
    return this.locationService.create(createLocationDto);
  }

  @ApiOperation({
    description: 'This API is for retrieving all locations in tree list.',
  })
  @ApiOkResponse({ description: 'Retrieving location list successfully' })
  @Get()
  findAll() {
    this.logger.verbose(`Retrieving all locations in tree list`);
    return this.locationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.verbose(`Retrieving a location with id: ${id}`);
    return this.locationService.findOne(+id);
  }

  @ApiOperation({ description: 'This API is for edit an existing location.' })
  @ApiParam({
    name: 'id',
    description: 'The location id needs editing',
    allowEmptyValue: false,
    examples: {
      a: {
        summary: 'The location with id: 1',
        description: 'Edit the location with id equal 1',
        value: '1',
      },
    },
  })
  @ApiBody({
    type: UpdateLocationDto,
    description: 'UpdateLocationDto',
    examples: {
      a: {
        summary: 'Empty Body',
        description:
          'Edit an existing location with information in the UpdateLocationDto',
        value: {
          building: 'A',
          location_name: 'Lobby',
          location_number: 'A-01',
          area: '18.000 m2',
        } as UpdateLocationDto,
      },
    },
  })
  @ApiOkResponse({
    description: 'Location updated successfully',
    schema: {
      type: 'json',
      example: {
        id: 123,
        building: 'A',
        location_name: 'Lobby',
        location_number: 'A-01',
        area: '18.000 m2',
        parent_id: 1,
        children: [],
        created_date: '2024-05-09T00:50:30.731Z',
        updated_date: '2024-05-09T00:50:30.731Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The editing location not found or parent location not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An exception occurred during updating location.',
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    this.logger.verbose(
      `Updating a location with id: ${id}, body: ${JSON.stringify(updateLocationDto)}`,
    );
    return this.locationService.update(+id, updateLocationDto);
  }

  @ApiOperation({
    description: 'This API is for deleting an existing location.',
  })
  @ApiParam({
    name: 'id',
    description: 'The location id needs deleting',
    allowEmptyValue: false,
    examples: {
      a: {
        summary: 'The location with id: 1',
        description: 'Edit the location with id equal 1',
        value: '1',
      },
    },
  })
  @ApiOkResponse({
    description: 'Location updated successfully',
    schema: {
      type: 'json',
      example: {
        building: 'A',
        location_name: 'Lobby',
        location_number: 'A-01',
        area: '18.000 m2',
        parent_id: 1,
        created_date: '2024-05-09T00:50:30.731Z',
        updated_date: '2024-05-09T00:50:30.731Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The deleting location not found or parent location not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'An exception occurred during the deletion.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.verbose(`Deleting a location with id: ${id}`);
    return this.locationService.remove(+id);
  }
}
