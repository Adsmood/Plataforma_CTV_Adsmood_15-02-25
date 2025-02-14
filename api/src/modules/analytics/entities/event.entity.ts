import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  adId: string;

  @Column()
  @Index()
  event: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  ip?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  dv360CampaignId?: string;

  @Column({ nullable: true })
  dv360CreativeId?: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  @Index()
  timestamp: Date;
} 