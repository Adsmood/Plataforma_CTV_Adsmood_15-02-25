import React, { useMemo } from 'react';
import styled from 'styled-components';
import { TimelineElement, Position, Scale } from '../../types/timeline';
import { getPropertyAtTime } from '../../utils/animation';

interface ElementRendererProps {
  element: TimelineElement;
  currentTime: number;
}

const StyledElement = styled.div<{
  position: Position;
  scale: Scale;
  rotation: number;
  opacity: number;
}>`
  position: absolute;
  transform: translate(${props => props.position.x}px, ${props => props.position.y}px)
             scale(${props => props.scale.x}, ${props => props.scale.y})
             rotate(${props => props.rotation}deg);
  opacity: ${props => props.opacity};
  transform-origin: center center;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
`;

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  currentTime,
}) => {
  const animatedProperties = useMemo(() => {
    const position = getPropertyAtTime(
      currentTime,
      element.keyframes.find(t => t.property === 'position')?.keyframes || [],
      element.duration,
      { x: 0, y: 0 }
    ) as Position;

    const scale = getPropertyAtTime(
      currentTime,
      element.keyframes.find(t => t.property === 'scale')?.keyframes || [],
      element.duration,
      { x: 1, y: 1 }
    ) as Scale;

    const rotation = getPropertyAtTime(
      currentTime,
      element.keyframes.find(t => t.property === 'rotation')?.keyframes || [],
      element.duration,
      0
    ) as number;

    const opacity = getPropertyAtTime(
      currentTime,
      element.keyframes.find(t => t.property === 'opacity')?.keyframes || [],
      element.duration,
      1
    ) as number;

    return { position, scale, rotation, opacity };
  }, [element.keyframes, currentTime, element.duration]);

  // Solo renderizar si el tiempo actual está dentro del rango del elemento
  if (currentTime < element.startTime || currentTime > element.startTime + element.duration) {
    return null;
  }

  return (
    <StyledElement
      position={animatedProperties.position}
      scale={animatedProperties.scale}
      rotation={animatedProperties.rotation}
      opacity={animatedProperties.opacity}
    >
      {/* Aquí renderizamos el contenido específico según el tipo de elemento */}
      {element.type === 'text' && <div>{element.properties.text}</div>}
      {element.type === 'image' && <img src={element.properties.url} alt={element.name} />}
      {/* Agregar más tipos de elementos según sea necesario */}
    </StyledElement>
  );
};

export default ElementRenderer; 