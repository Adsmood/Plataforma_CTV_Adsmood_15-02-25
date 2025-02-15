import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Impression } from './impression.entity';

@Entity('video_events')
export class VideoEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    impressionId: number;

    @Column()
    eventType: string;

    @Column({ type: 'timestamp with time zone' })
    timestamp: Date;

    @Column({ nullable: true })
    progressPercent: number;

    @Column()
    platform: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @ManyToOne(() => Impression, impression => impression.events)
    @JoinColumn({ name: 'impressionId' })
    impression: Impression;
} 