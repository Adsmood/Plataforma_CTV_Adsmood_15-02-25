import { create } from 'zustand';

interface Asset {
    id: string;
    url: string;
    type: 'video' | 'image';
    originalName: string;
    size: number;
}

interface AssetStore {
    assets: Asset[];
    addAsset: (asset: Omit<Asset, 'id'>) => void;
    removeAsset: (id: string) => void;
    clearAssets: () => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
    assets: [],
    addAsset: (asset) => set((state) => ({
        assets: [...state.assets, { ...asset, id: Date.now().toString() }]
    })),
    removeAsset: (id) => set((state) => ({
        assets: state.assets.filter(asset => asset.id !== id)
    })),
    clearAssets: () => set({ assets: [] })
})); 