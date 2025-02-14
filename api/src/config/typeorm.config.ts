import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Event } from '../modules/analytics/entities/event.entity';
import { AdStats } from '../modules/analytics/entities/ad-stats.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'adsmood_ctv'),
  entities: [Event, AdStats],
  synchronize: configService.get('NODE_ENV') !== 'production',
  ssl: configService.get('DB_SSL') === 'true' ? {
    rejectUnauthorized: false,
  } : false,
}); 