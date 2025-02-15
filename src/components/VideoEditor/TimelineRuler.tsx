import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TimelineRulerProps } from '../../types/timeline';

const RulerContainer = styled.div<{ scale: number }>`
  position: relative;
  height: 24px;
  background: ${props => props.theme.colors.background.dark};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MarkersCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const TimeLabel = styled.div`
  position: absolute;
  top: 4px;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
`;

const Guide = styled.div<{ position: number }>`
  position: absolute;
  left: ${props => props.position}px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -3px;
    width: 7px;
    height: 7px;
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(45deg);
  }
`;

const TimelineRuler: React.FC<TimelineRulerProps> = ({
  scale,
  duration,
  width,
  guides = [],
  onAddGuide,
  onRemoveGuide,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas para alta resolución
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = 24 * dpr;
    ctx.scale(dpr, dpr);

    // Limpiar el canvas
    ctx.clearRect(0, 0, width, 24);

    // Dibujar marcadores
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // Calcular el intervalo de marcadores basado en el zoom
    const interval = scale < 100 ? 1 : scale < 200 ? 0.5 : 0.25;
    const subInterval = interval / 4;

    // Dibujar marcadores y etiquetas
    for (let time = 0; time <= duration; time += subInterval) {
      const x = time * scale;
      const isMajorMark = time % interval === 0;
      
      ctx.beginPath();
      ctx.moveTo(x, isMajorMark ? 0 : 12);
      ctx.lineTo(x, 24);
      ctx.stroke();

      if (isMajorMark) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const label = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        ctx.fillText(label, x, 10);
      }
    }
  }, [scale, duration, width]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!onAddGuide) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / scale;
    
    if (time >= 0 && time <= duration) {
      onAddGuide(time);
    }
  };

  return (
    <RulerContainer scale={scale} onDoubleClick={handleDoubleClick}>
      <MarkersCanvas ref={canvasRef} />
      {guides.map((time, index) => (
        <Guide
          key={index}
          position={time * scale}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onRemoveGuide?.(time);
          }}
        />
      ))}
    </RulerContainer>
  );
};

export default TimelineRuler; 