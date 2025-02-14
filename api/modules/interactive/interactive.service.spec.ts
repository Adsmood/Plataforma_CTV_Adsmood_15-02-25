import { Test, TestingModule } from '@nestjs/testing';
import { InteractiveService } from './interactive.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { InteractionType, OverlayType } from './dto/interactive.dto';

describe('InteractiveService', () => {
  let service: InteractiveService;
  let prisma: PrismaService;

  type MockPrismaService = {
    $queryRaw: jest.Mock;
    $executeRaw: jest.Mock;
    $transaction: jest.Mock<Promise<any>>;
  };

  const mockPrismaService: MockPrismaService = {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
    $transaction: jest.fn((callback) => Promise.resolve(callback(mockPrismaService))),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractiveService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InteractiveService>(InteractiveService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInteraction', () => {
    it('should create an interaction', async () => {
      const adId = 'ad-1';
      const dto = {
        type: InteractionType.BUTTON,
        config: { action: 'test' },
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        startTime: 0,
        endTime: 10,
      };

      const mockResult = [{
        id: 'int-1',
        type: dto.type,
        config: JSON.stringify(dto.config),
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        start_time: dto.startTime,
        end_time: dto.endTime,
        ad_id: adId,
        created_at: new Date(),
        updated_at: new Date(),
      }];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResult);

      const result = await service.createInteraction(adId, dto);
      expect(result).toEqual({
        ...mockResult[0],
        config: dto.config,
        position: dto.position,
        size: dto.size,
      });
    });
  });

  describe('createOverlay', () => {
    it('should create an overlay', async () => {
      const adId = 'ad-1';
      const dto = {
        type: OverlayType.IMAGE,
        content: 'https://example.com/test.jpg',
        position: { x: 50, y: 50 },
        size: { width: 100, height: 100 },
        startTime: 0,
        endTime: 10,
        styles: { opacity: 0.5 },
        zIndex: 1,
      };

      const mockResult = [{
        id: 'ovl-1',
        type: dto.type,
        content: dto.content,
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        start_time: dto.startTime,
        end_time: dto.endTime,
        styles: JSON.stringify(dto.styles),
        z_index: dto.zIndex,
        ad_id: adId,
        created_at: new Date(),
        updated_at: new Date(),
      }];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResult);

      const result = await service.createOverlay(adId, dto);
      expect(result).toEqual({
        ...mockResult[0],
        position: dto.position,
        size: dto.size,
        styles: dto.styles,
      });
    });
  });

  describe('getInteractiveData', () => {
    it('should return parsed interactions and overlays', async () => {
      const adId = 'ad-1';
      const mockInteractions = [{
        id: 'int-1',
        type: InteractionType.BUTTON,
        config: JSON.stringify({ action: 'test' }),
        position: JSON.stringify({ x: 50, y: 50 }),
        size: JSON.stringify({ width: 100, height: 100 }),
        start_time: 0,
        end_time: 10,
        ad_id: adId,
        created_at: new Date(),
        updated_at: new Date(),
      }];

      const mockOverlays = [{
        id: 'ovl-1',
        type: OverlayType.IMAGE,
        content: 'https://example.com/test.jpg',
        position: JSON.stringify({ x: 50, y: 50 }),
        size: JSON.stringify({ width: 100, height: 100 }),
        styles: JSON.stringify({ opacity: 0.5 }),
        start_time: 0,
        end_time: 10,
        z_index: 1,
        ad_id: adId,
        created_at: new Date(),
        updated_at: new Date(),
      }];

      mockPrismaService.$queryRaw
        .mockResolvedValueOnce(mockInteractions)
        .mockResolvedValueOnce(mockOverlays);

      const result = await service.getInteractiveData(adId);

      expect(result.interactions[0].config).toEqual({ action: 'test' });
      expect(result.interactions[0].position).toEqual({ x: 50, y: 50 });
      expect(result.overlays[0].position).toEqual({ x: 50, y: 50 });
      expect(result.overlays[0].styles).toEqual({ opacity: 0.5 });
    });
  });
});