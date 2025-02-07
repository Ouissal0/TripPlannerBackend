import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createTripDto: CreateTripDto) {
    // For testing purposes, we'll create a mock user
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    return this.tripsService.create(createTripDto, mockUser as any);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({ status: 200, description: 'Returns all trips.' })
  async findAll() {
    // For testing purposes, we'll use a mock user
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    return this.tripsService.findAll(mockUser as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific trip by ID' })
  @ApiResponse({ status: 200, description: 'Returns the trip.' })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  async findOne(@Param('id') id: string) {
    // For testing purposes, we'll use a mock user
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    return this.tripsService.findOne(id, mockUser as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a trip' })
  @ApiResponse({ status: 200, description: 'Trip has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: Partial<CreateTripDto>,
  ) {
    // For testing purposes, we'll use a mock user
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    return this.tripsService.update(id, updateTripDto, mockUser as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiResponse({ status: 200, description: 'Trip has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Trip not found.' })
  async remove(@Param('id') id: string) {
    // For testing purposes, we'll use a mock user
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    return this.tripsService.remove(id, mockUser as any);
  }
}
