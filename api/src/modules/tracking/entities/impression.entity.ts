import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { VideoEvent } from './video-event.entity';
import { Interaction } from './interaction.entity';

@Entity('impressions')
export class Impression {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creativeId: string;

    @Column()
    platform: string;

    @Column({ type: 'timestamp with time zone' })
    timestamp: Date;

    @Column({ nullable: true })
    deviceType: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true, type: 'text' })
    userAgent: string;

    @Column({ nullable: true, length: 2 })
    country: string;

    @Column({ nullable: true })
    region: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @OneToMany(() => VideoEvent, event => event.impression)
    events: VideoEvent[];

    @OneToMany(() => Interaction, interaction => interaction.impression)
    interactions: Interaction[];
} 