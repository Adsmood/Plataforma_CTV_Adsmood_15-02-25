import { Test, TestingModule } from '@nestjs/testing';
import { InteractiveService } from './interactive.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { InteractionType, OverlayType } from './dto/interactive.dto';

describe('InteractiveService', () => {
  let service: InteractiveService;
  let prisma: PrismaService;

  const mockPrismaService = {
    interaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    overlay: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
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

      const expected = {
        id: 'int-1',
        ...dto,
        adId,
        config: JSON.stringify(dto.config),
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.interaction.create.mockResolvedValue(expected);

      const result = await service.createInteraction(adId, dto);
      expect(result).toEqual(expected);
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

      const expected = {
        id: 'ovl-1',
        ...dto,
        adId,
        position: JSON.stringify(dto.position),
        size: JSON.stringify(dto.size),
        styles: JSON.stringify(dto.styles),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.overlay.create.mockResolvedValue(expected);

      const result = await service.createOverlay(adId, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('getInteractiveData', () => {
    it('should return parsed interactions and overlays', async () => {
      const adId = 'ad-1';
      const mockInteraction = {
        id: 'int-1',
        type: InteractionType.BUTTON,
        config: JSON.stringify({ action: 'test' }),
        position: JSON.stringify({ x: 50, y: 50 }),
        size: JSON.stringify({ width: 100, height: 100 }),
        startTime: 0,
        endTime: 10,
        adId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockOverlay = {
        id: 'ovl-1',
        type: OverlayType.IMAGE,
        content: 'https://example.com/test.jpg',
        position: JSON.stringify({ x: 50, y: 50 }),
        size: JSON.stringify({ width: 100, height: 100 }),
        styles: JSON.stringify({ opacity: 0.5 }),
        startTime: 0,
        endTime: 10,
        zIndex: 1,
        adId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.interaction.findMany.mockResolvedValue([mockInteraction]);
      mockPrismaService.overlay.findMany.mockResolvedValue([mockOverlay]);

      const result = await service.getInteractiveData(adId);

      expect(result.interactions[0].config).toEqual({ action: 'test' });
      expect(result.interactions[0].position).toEqual({ x: 50, y: 50 });
      expect(result.overlays[0].position).toEqual({ x: 50, y: 50 });
      expect(result.overlays[0].styles).toEqual({ opacity: 0.5 });
    });
  });
});