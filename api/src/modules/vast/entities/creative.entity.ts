import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VideoVariant } from './video-variant.entity';

interface InteractiveButton {
    label: string;
    url: string;
    position: { x: number; y: number };
    style?: Record<string, any>;
}

interface CarouselItem {
    title: string;
    description: string;
    imageUrl: string;
    price?: string;
    url: string;
}

interface GalleryImage {
    url: string;
    title?: string;
    description?: string;
}

interface CompanionAd {
    width: number;
    height: number;
    url: string;
    clickThroughUrl: string;
}

interface InteractiveData {
    background?: {
        url: string;
        style?: Record<string, any>;
    };
    buttons?: InteractiveButton[];
    carousel?: {
        items: CarouselItem[];
        position?: { x: number; y: number };
        style?: Record<string, any>;
    };
    gallery?: {
        images: GalleryImage[];
        position?: { x: number; y: number };
        style?: Record<string, any>;
    };
    overlayUrl?: string;
    clickThroughUrl: string;
    customParams?: Record<string, string>;
    companions?: CompanionAd[];
}

@Entity('creatives')
export class Creative {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    campaignId: string;

    @Column()
    advertiserId: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    duration: number;

    @Column()
    width: number;

    @Column()
    height: number;

    @Column({ type: 'jsonb', nullable: true })
    interactive: InteractiveData;

    @OneToMany(() => VideoVariant, variant => variant.creative, {
        cascade: true,
        eager: true
    })
    videoVariants: VideoVariant[];

    @Column({ type: 'jsonb', nullable: true })
    dv360: {
        campaignId?: string;
        creativeId?: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    samid?: {
        creativeId: string;
        creativeType: string;
    };

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
} 