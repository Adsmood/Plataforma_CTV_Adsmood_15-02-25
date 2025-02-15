import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Impression } from './impression.entity';

@Entity('interactions')
export class Interaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    impressionId: number;

    @Column()
    interactionType: string;

    @Column({ type: 'timestamp with time zone' })
    timestamp: Date;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @Column()
    platform: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @ManyToOne(() => Impression, impression => impression.interactions)
    @JoinColumn({ name: 'impressionId' })
    impression: Impression;
} 