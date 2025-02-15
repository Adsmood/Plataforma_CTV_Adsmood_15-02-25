import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1709901234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tabla de Campañas
        await queryRunner.query(`
            CREATE TABLE campaigns (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                advertiser_id VARCHAR(255) NOT NULL,
                platform VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de Creative/Anuncios
        await queryRunner.query(`
            CREATE TABLE creatives (
                id SERIAL PRIMARY KEY,
                campaign_id INTEGER REFERENCES campaigns(id),
                vast_url TEXT NOT NULL,
                video_url TEXT NOT NULL,
                interactive_type VARCHAR(50),
                duration INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de Impresiones
        await queryRunner.query(`
            CREATE TABLE impressions (
                id SERIAL PRIMARY KEY,
                creative_id INTEGER REFERENCES creatives(id),
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                platform VARCHAR(50) NOT NULL,
                device_type VARCHAR(50),
                ip_address VARCHAR(45),
                user_agent TEXT,
                country VARCHAR(2),
                region VARCHAR(50)
            );
        `);

        // Tabla de Eventos de Video
        await queryRunner.query(`
            CREATE TABLE video_events (
                id SERIAL PRIMARY KEY,
                impression_id INTEGER REFERENCES impressions(id),
                event_type VARCHAR(20) NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                progress_percent INTEGER,
                CONSTRAINT valid_event_type CHECK (
                    event_type IN ('start', 'firstQuartile', 'midpoint', 'thirdQuartile', 'complete', 'mute', 'unmute', 'pause', 'resume', 'skip')
                )
            );
        `);

        // Tabla de Interacciones
        await queryRunner.query(`
            CREATE TABLE interactions (
                id SERIAL PRIMARY KEY,
                impression_id INTEGER REFERENCES impressions(id),
                interaction_type VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB
            );
        `);

        // Índices para optimizar queries
        await queryRunner.query(`
            CREATE INDEX idx_impressions_creative_id ON impressions(creative_id);
            CREATE INDEX idx_impressions_timestamp ON impressions(timestamp);
            CREATE INDEX idx_video_events_impression_id ON video_events(impression_id);
            CREATE INDEX idx_interactions_impression_id ON interactions(impression_id);
            CREATE INDEX idx_creatives_campaign_id ON creatives(campaign_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_creatives_campaign_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_interactions_impression_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_video_events_impression_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_impressions_timestamp`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_impressions_creative_id`);
        
        await queryRunner.query(`DROP TABLE IF EXISTS interactions`);
        await queryRunner.query(`DROP TABLE IF EXISTS video_events`);
        await queryRunner.query(`DROP TABLE IF EXISTS impressions`);
        await queryRunner.query(`DROP TABLE IF EXISTS creatives`);
        await queryRunner.query(`DROP TABLE IF EXISTS campaigns`);
    }
} 