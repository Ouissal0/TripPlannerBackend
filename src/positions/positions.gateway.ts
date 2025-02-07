import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Socket } from 'socket.io';

import { PositionsService } from './positions.service';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PositionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PositionsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly positionsService: PositionsService) {}

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Client connected: ${client.id}`);
      const token = client.handshake.auth.token;
      if (!token) {
        throw new WsException('Authentication token not provided');
      }
      // Stockez l'ID du client pour un nettoyage ultérieur
      client.data.authenticated = true;
      this.logger.log(`Client authenticated: ${client.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      this.logger.log(`Client disconnected: ${client.id}`);
      // Nettoyage des ressources
      await this.positionsService.handleUserDisconnect(client.id);
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('updatePosition')
  async handlePosition(client: Socket, payload: UpdatePositionDto) {
    try {
      if (!client.data.authenticated) {
        throw new WsException('Client not authenticated');
      }
      // Validation automatique du DTO
      const position = await this.positionsService.create({
        userId: payload.userId,
        tripId: payload.tripId,
        latitude: payload.latitude,
        longitude: payload.longitude,
      });

      // Émettre la position à tous les membres du voyage
      this.server.to(`trip_${payload.tripId}`).emit('positionUpdate', {
        userId: payload.userId,
        position: {
          latitude: payload.latitude,
          longitude: payload.longitude,
          timestamp: new Date(),
        },
      });

      return position;
    } catch (error) {
      this.logger.error(`Error updating position: ${error.message}`);
      throw new WsException({
        status: 'error',
        message: 'Failed to update position',
        details: error.message,
      });
    }
  }

  @SubscribeMessage('joinTrip')
  async handleJoinTrip(client: Socket, tripId: number) {
    try {
      if (!tripId) {
        throw new WsException('Trip ID is required');
      }
      await client.join(`trip_${tripId}`);
      this.logger.log(`Client ${client.id} joined trip ${tripId}`);
    } catch (error) {
      this.logger.error(`Error joining trip: ${error.message}`);
      throw new WsException({
        status: 'error',
        message: 'Failed to join trip',
        details: error.message,
      });
    }
  }

  @SubscribeMessage('leaveTrip')
  async handleLeaveTrip(client: Socket, tripId: number) {
    try {
      if (!tripId) {
        throw new WsException('Trip ID is required');
      }
      await client.leave(`trip_${tripId}`);
      this.logger.log(`Client ${client.id} left trip ${tripId}`);
    } catch (error) {
      this.logger.error(`Error leaving trip: ${error.message}`);
      throw new WsException({
        status: 'error',
        message: 'Failed to leave trip',
        details: error.message,
      });
    }
  }
}
