import { Test, TestingModule } from '@nestjs/testing';
import { InteractiveController } from './interactive.controller';
import { InteractiveService } from './interactive.service';
import { InteractionType, OverlayType } from './dto/interactive.dto';

describe('InteractiveController', () => {
  let controller: InteractiveController;
  let service: InteractiveService;

  const mockInteractiveService = {
    createInteraction: jest.fn(),
    updateInteraction: jest.fn(),
    deleteInteraction: jest.fn(),
    getInteractions: jest.fn(),
    createOverlay: jest.fn(),
    updateOverlay: jest.fn(),
    deleteOverlay: jest.fn(),
    getOverlays: jest.fn(),
    getInteractiveData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractiveController],
      providers: [
        {
          provide: InteractiveService,
          useValue: mockInteractiveService,
        },
      ],
    }).compile();

    controller = module.get<InteractiveController>(InteractiveController);
    service = module.get<InteractiveService>(InteractiveService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        id: 1,
        ...dto,
        adId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInteractiveService.createInteraction.mockResolvedValue(expected);

      const result = await controller.createInteraction(adId, dto);
      expect(result).toEqual(expected);
      expect(service.createInteraction).toHaveBeenCalledWith(adId, dto);
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
        id: 1,
        ...dto,
        adId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockInteractiveService.createOverlay.mockResolvedValue(expected);

      const result = await controller.createOverlay(adId, dto);
      expect(result).toEqual(expected);
      expect(service.createOverlay).toHaveBeenCalledWith(adId, dto);
    });
  });

  describe('getInteractiveData', () => {
    it('should return interactive data', async () => {
      const adId = 'ad-1';
      const expected = {
        interactions: [
          {
            id: 1,
            type: InteractionType.BUTTON,
            config: { action: 'test' },
            position: { x: 50, y: 50 },
            size: { width: 100, height: 100 },
            startTime: 0,
            endTime: 10,
            adId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        overlays: [
          {
            id: 1,
            type: OverlayType.IMAGE,
            content: 'https://example.com/test.jpg',
            position: { x: 50, y: 50 },
            size: { width: 100, height: 100 },
            startTime: 0,
            endTime: 10,
            styles: { opacity: 0.5 },
            zIndex: 1,
            adId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      mockInteractiveService.getInteractiveData.mockResolvedValue(expected);

      const result = await controller.getInteractiveData(adId);
      expect(result).toEqual(expected);
      expect(service.getInteractiveData).toHaveBeenCalledWith(adId);
    });
  });
}); 