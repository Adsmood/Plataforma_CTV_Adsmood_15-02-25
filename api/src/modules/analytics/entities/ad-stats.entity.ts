import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('ad_stats')
export class AdStats {
  @PrimaryColumn()
  adId: string;

  @Column({ default: 0 })
  impressions: number;

  @Column({ default: 0 })
  starts: number;

  @Column({ default: 0 })
  firstQuartiles: number;

  @Column({ default: 0 })
  midpoints: number;

  @Column({ default: 0 })
  thirdQuartiles: number;

  @Column({ default: 0 })
  completes: number;

  @Column({ default: 0 })
  clicks: number;

  @Column({ default: 0 })
  errors: number;

  @Column({ type: 'jsonb', default: {} })
  platformStats: {
    [key: string]: {
      impressions: number;
      starts: number;
      firstQuartiles: number;
      midpoints: number;
      thirdQuartiles: number;
      completes: number;
      clicks: number;
      errors: number;
    };
  };

  @UpdateDateColumn()
  updatedAt: Date;
} 