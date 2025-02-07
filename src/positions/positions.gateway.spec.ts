import { Test, TestingModule } from '@nestjs/testing';
import { PositionsGateway } from './positions.gateway';
import { PositionsService } from './positions.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

describe('PositionsGateway', () => {
  let gateway: PositionsGateway;
  let positionsService: PositionsService;

  const mockSocket = {
    id: 'test-socket-id',
    join: jest.fn(),
    leave: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    get handshake() {
      return { auth: {} }; // Absence du token
    },
  } as unknown as Socket;
  
  const mockPositionsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsGateway,
        {
          provide: PositionsService,
          useValue: mockPositionsService,
        },
      ],
    }).compile();

    gateway = module.get<PositionsGateway>(PositionsGateway);
    positionsService = module.get<PositionsService>(PositionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should log when client connects', async () => {
      const logSpy = jest.spyOn(gateway['logger'], 'log');
      await gateway.handleConnection(mockSocket);
      expect(logSpy).toHaveBeenCalledWith(`Client connected: ${mockSocket.id}`);
    });
  
    it('should handle connection error due to missing token', async () => {
      const errorSpy = jest.spyOn(gateway['logger'], 'error');
     
      await gateway.handleConnection(mockSocket);
      expect(errorSpy).toHaveBeenCalledWith(`Connection error: Authentication token not provided`);
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
  

  describe('handlePosition', () => {
    const mockPayload = {
      userId: 1,
      tripId: 1,
      latitude: 45.0,
      longitude: -75.0,
    };

    it('should create position and emit update', async () => {
      const mockPosition = { ...mockPayload, id: 1 };
      mockPositionsService.create.mockResolvedValueOnce(mockPosition);
      gateway.server = { to: jest.fn().mockReturnValue({ emit: jest.fn() }) } as any;

      const result = await gateway.handlePosition(mockSocket, mockPayload);

      expect(positionsService.create).toHaveBeenCalledWith(mockPayload);
      expect(result).toBe(mockPosition);
      expect(gateway.server.to).toHaveBeenCalledWith(`trip_${mockPayload.tripId}`);
    });

    it('should throw WsException on error', async () => {
      mockPositionsService.create.mockRejectedValueOnce(new Error('Database error'));

      await expect(gateway.handlePosition(mockSocket, mockPayload))
        .rejects
        .toThrow(WsException);
    });
  });

  describe('handleJoinTrip', () => {
    it('should allow client to join trip room', async () => {
      const tripId = 1;
      
      await gateway.handleJoinTrip(mockSocket, tripId);
      
      expect(mockSocket.join).toHaveBeenCalledWith(`trip_${tripId}`);
    });

    it('should throw WsException when tripId is missing', async () => {
      await expect(gateway.handleJoinTrip(mockSocket, null))
        .rejects
        .toThrow(WsException);
    });
  });

  describe('handleLeaveTrip', () => {
    it('should allow client to leave trip room', async () => {
      const tripId = 1;
      
      await gateway.handleLeaveTrip(mockSocket, tripId);
      
      expect(mockSocket.leave).toHaveBeenCalledWith(`trip_${tripId}`);
    });

    it('should throw WsException when tripId is missing', async () => {
      await expect(gateway.handleLeaveTrip(mockSocket, null))
        .rejects
        .toThrow(WsException);
    });
  });
});
