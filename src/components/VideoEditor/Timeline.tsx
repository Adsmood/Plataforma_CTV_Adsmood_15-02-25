import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { TimelineElement } from '../../types/timeline';
import { default as TimelineRulerComponent } from './TimelineRuler';

const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: ${props => props.theme.colors.background.dark};
  overflow: hidden;
`;

const TimelineTracks = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 24px);
  overflow-x: auto;
  overflow-y: hidden;
`;

const Element = styled.div<{ isSelected: boolean }>`
  position: absolute;
  height: 36px;
  background: ${props => props.theme.colors.primary.main};
  border: 1px solid ${props => props.isSelected ? props.theme.colors.primary.light : 'transparent'};
  border-radius: 4px;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: move;
  user-select: none;

  &:hover {
    border-color: ${props => props.theme.colors.primary.light};
  }

  .resize-handle {
    display: none;
  }

  &:hover .resize-handle {
    display: block;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  width: 8px;
  height: 100%;
  cursor: col-resize;

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
`;

const CurrentTimeLine = styled.div`
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: red;
  pointer-events: none;
`;

interface DraggingState {
  id: string;
  type: 'move' | 'resize-start' | 'resize-end';
  initialX: number;
  initialTime: number;
  initialDuration: number;
}

interface TimelineProps {
  elements: TimelineElement[];
  duration: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onElementChange: (element: TimelineElement) => void;
  onElementSelect: (id: string | null) => void;
  selectedElementId: string | null;
}

const Timeline: React.FC<TimelineProps> = ({
  elements,
  duration,
  currentTime,
  onTimeUpdate,
  onElementChange,
  onElementSelect,
  selectedElementId,
}) => {
  const [scale, setScale] = useState(100);
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const [guides, setGuides] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains('resize-handle');
    const isLeftHandle = target.classList.contains('left');
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    
    setDragging({
      id: elementId,
      type: isResizeHandle ? (isLeftHandle ? 'resize-start' : 'resize-end') : 'move',
      initialX: x,
      initialTime: element.startTime,
      initialDuration: element.duration,
    });

    onElementSelect(elementId);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const deltaX = x - dragging.initialX;
    const deltaTime = deltaX / scale;

    const element = elements.find(el => el.id === dragging.id);
    if (!element) return;

    const updatedElement = { ...element };

    if (dragging.type === 'move') {
      const newStartTime = Math.max(0, dragging.initialTime + deltaTime);
      if (newStartTime + element.duration <= duration) {
        updatedElement.startTime = newStartTime;
      }
    } else if (dragging.type === 'resize-start') {
      const newStartTime = Math.max(0, dragging.initialTime + deltaTime);
      const newDuration = Math.max(0.1, dragging.initialDuration - deltaTime);
      if (newStartTime >= 0 && newDuration > 0) {
        updatedElement.startTime = newStartTime;
        updatedElement.duration = newDuration;
      }
    } else {
      const newDuration = Math.max(0.1, dragging.initialDuration + deltaTime);
      if (dragging.initialTime + newDuration <= duration) {
        updatedElement.duration = newDuration;
      }
    }

    onElementChange(updatedElement);
  }, [dragging, elements, scale, duration, onElementChange]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleAddGuide = useCallback((time: number) => {
    setGuides(prev => [...prev, time].sort((a, b) => a - b));
  }, []);

  const handleRemoveGuide = useCallback((time: number) => {
    setGuides(prev => prev.filter(t => t !== time));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.max(50, Math.min(400, prev * delta)));
    }
  }, []);

  return (
    <TimelineContainer
      ref={timelineRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <TimelineRulerComponent
        scale={scale}
        duration={duration}
        width={timelineRef.current?.clientWidth || 0}
        guides={guides}
        onAddGuide={handleAddGuide}
        onRemoveGuide={handleRemoveGuide}
      />
      <TimelineTracks>
        {elements.map((element) => (
          <Element
            key={element.id}
            style={{
              left: `${element.startTime * scale}px`,
              width: `${element.duration * scale}px`,
              top: `${element.track * 40}px`,
            }}
            isSelected={element.id === selectedElementId}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
          >
            <ResizeHandle className="resize-handle left" data-resize="start" />
            {element.name}
            <ResizeHandle className="resize-handle right" data-resize="end" />
          </Element>
        ))}
        <CurrentTimeLine style={{ left: `${currentTime * scale}px` }} />
      </TimelineTracks>
    </TimelineContainer>
  );
};

export default Timeline; 