import { VastService } from './vast.service';
export declare class VastController {
    private readonly vastService;
    constructor(vastService: VastService);
    generateVast(id: string, platform?: string): Promise<string>;
}
