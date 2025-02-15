import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Creative } from './creative.entity';

@Entity('video_variants')
export class VideoVariant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creativeId: number;

    @Column()
    platform: string;

    @Column()
    url: string;

    @Column({ type: 'jsonb' })
    format: {
        codec: string;
        resolution: string;
        fps: number;
        bitrate: number;
        width: number;
        height: number;
    };

    @ManyToOne(() => Creative, creative => creative.videoVariants)
    @JoinColumn({ name: 'creativeId' })
    creative: Creative;
} 