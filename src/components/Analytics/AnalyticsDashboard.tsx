import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';

interface AnalyticsData {
    impressions: number;
    uniqueDevices: number;
    completionRate: number;
    interactionRate: number;
    avgWatchTime: number;
    events: Record<string, number>;
    interactions: Record<string, number>;
}

interface TimelineEvent {
    type: string;
    timestamp: Date;
    platform: string;
    progress?: number;
    deviceType?: string;
    country?: string;
}

interface TimelineInteraction {
    type: string;
    timestamp: Date;
    platform: string;
    metadata?: any;
    deviceType?: string;
    country?: string;
}

interface PlatformStats {
    platform: string;
    impressions: number;
    uniqueDevices: number;
}

interface AnalyticsDashboardProps {
    creativeId: string;
    onError?: (error: Error) => void;
}

const Container = styled.div`
    padding: 24px;
    background: ${props => props.theme.colors.backgroundWhite};
`;

const Header = styled.div`
    margin-bottom: 24px;
`;

const Title = styled.h1`
    font-size: ${props => props.theme.typography.fontSize.xl};
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 8px;
`;

const TabsContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    border-bottom: 1px solid ${props => props.theme.colors.borderColor};
`;

const Tab = styled.button<{ active: boolean }>`
    padding: 8px 16px;
    border: none;
    background: none;
    color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
    border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
    cursor: pointer;
    font-weight: ${props => props.active ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.regular};
    transition: all ${props => props.theme.transitions.default};

    &:hover {
        color: ${props => props.theme.colors.primary};
    }
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
`;

const MetricCard = styled.div`
    padding: 16px;
    background: ${props => props.theme.colors.backgroundLight};
    border-radius: ${props => props.theme.borderRadius.md};
    box-shadow: ${props => props.theme.shadows.sm};
`;

const MetricValue = styled.div`
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.primary};
    margin-bottom: 4px;
`;

const MetricLabel = styled.div`
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.textSecondary};
`;

const ChartContainer = styled.div`
    height: 400px;
    margin-bottom: 24px;
    padding: 16px;
    background: ${props => props.theme.colors.backgroundWhite};
    border-radius: ${props => props.theme.borderRadius.md};
    box-shadow: ${props => props.theme.shadows.sm};
`;

const TimelineContainer = styled.div`
    margin-top: 24px;
`;

const TimelineItem = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-left: 2px solid ${props => props.theme.colors.primary};
    margin-bottom: 8px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const TimelineContent = styled.div`
    margin-left: 16px;
`;

const TimelineTime = styled.div`
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.textSecondary};
`;

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
    creativeId,
    onError
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'platforms'>('overview');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<{
        startDate?: Date;
        endDate?: Date;
    }>({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 días
        endDate: new Date()
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [statsData, eventsData, platformData] = await Promise.all([
                    analyticsService.getStats(creativeId, dateRange),
                    analyticsService.getEvents(creativeId, dateRange),
                    analyticsService.getPlatformStats(creativeId, dateRange)
                ]);

                setAnalyticsData(statsData);
                setEvents(eventsData.events);
                setPlatformStats(platformData);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                setError(errorMessage);
                onError?.(error instanceof Error ? error : new Error(errorMessage));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [creativeId, dateRange, onError]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (error) {
        return (
            <Container>
                <div style={{ color: 'red' }}>Error: {error}</div>
            </Container>
        );
    }

    if (isLoading || !analyticsData) {
        return (
            <Container>
                <div>Cargando datos...</div>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title>Analytics Dashboard</Title>
                <TabsContainer>
                    <Tab
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    >
                        Vista General
                    </Tab>
                    <Tab
                        active={activeTab === 'events'}
                        onClick={() => setActiveTab('events')}
                    >
                        Eventos
                    </Tab>
                    <Tab
                        active={activeTab === 'platforms'}
                        onClick={() => setActiveTab('platforms')}
                    >
                        Plataformas
                    </Tab>
                </TabsContainer>
            </Header>

            {activeTab === 'overview' && (
                <>
                    <MetricsGrid>
                        <MetricCard>
                            <MetricValue>{formatNumber(analyticsData.impressions)}</MetricValue>
                            <MetricLabel>Impresiones</MetricLabel>
                        </MetricCard>
                        <MetricCard>
                            <MetricValue>{formatNumber(analyticsData.uniqueDevices)}</MetricValue>
                            <MetricLabel>Dispositivos Únicos</MetricLabel>
                        </MetricCard>
                        <MetricCard>
                            <MetricValue>{formatPercentage(analyticsData.completionRate)}</MetricValue>
                            <MetricLabel>Tasa de Completado</MetricLabel>
                        </MetricCard>
                        <MetricCard>
                            <MetricValue>{formatPercentage(analyticsData.interactionRate)}</MetricValue>
                            <MetricLabel>Tasa de Interacción</MetricLabel>
                        </MetricCard>
                        <MetricCard>
                            <MetricValue>{formatTime(analyticsData.avgWatchTime)}</MetricValue>
                            <MetricLabel>Tiempo Promedio de Visualización</MetricLabel>
                        </MetricCard>
                    </MetricsGrid>

                    <ChartContainer>
                        <ResponsiveContainer>
                            <LineChart data={events}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="timestamp" 
                                    tickFormatter={(value: number) => new Date(value).toLocaleDateString()}
                                />
                                <YAxis />
                                <Tooltip 
                                    labelFormatter={(value: number) => new Date(value).toLocaleString()}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="progress"
                                    stroke="#4a90e2"
                                    name="Progreso de Visualización"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </>
            )}

            {activeTab === 'events' && (
                <TimelineContainer>
                    {events.map((event, index) => (
                        <TimelineItem key={index}>
                            <TimelineContent>
                                <div>{event.type}</div>
                                <TimelineTime>
                                    {new Date(event.timestamp).toLocaleString()}
                                    {event.platform && ` - ${event.platform}`}
                                    {event.progress && ` - ${event.progress}%`}
                                </TimelineTime>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </TimelineContainer>
            )}

            {activeTab === 'platforms' && (
                <ChartContainer>
                    <ResponsiveContainer>
                        <BarChart data={platformStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="platform" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="impressions" fill="#4a90e2" name="Impresiones" />
                            <Bar dataKey="uniqueDevices" fill="#82ca9d" name="Dispositivos Únicos" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}
        </Container>
    );
}; 