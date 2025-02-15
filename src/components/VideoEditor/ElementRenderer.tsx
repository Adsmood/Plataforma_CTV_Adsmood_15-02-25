import React, { useMemo } from 'react';
import styled from 'styled-components';
import { TimelineElement, Position, Scale, ElementProperties } from '../../types/timeline';
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
  width: number;
  height: number;
}>`
  position: absolute;
  transform: translate(${props => props.position.x}px, ${props => props.position.y}px)
             scale(${props => props.scale.x}, ${props => props.scale.y})
             rotate(${props => props.rotation}deg);
  opacity: ${props => props.opacity};
  transform-origin: center center;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

const StyledText = styled.div<{ properties: ElementProperties }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.properties.style?.color || props.theme.colors.text.primary};
  font-size: ${props => props.properties.style?.fontSize || '16px'};
  font-weight: ${props => props.properties.style?.fontWeight || 'normal'};
  background-color: ${props => props.properties.style?.backgroundColor || 'transparent'};
  text-align: center;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  pointer-events: none;
  user-select: none;
`;

const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  currentTime,
}) => {
  const animatedProperties = useMemo(() => {
    try {
      // Validar que el elemento tenga las propiedades necesarias
      if (!element.keyframes || !Array.isArray(element.keyframes)) {
        throw new Error('Keyframes inválidos');
      }

      const position = getPropertyAtTime(
        currentTime,
        element.keyframes.find(t => t.property === 'position')?.keyframes || [],
        element.duration,
        'position'
      ) as Position;

      const scale = getPropertyAtTime(
        currentTime,
        element.keyframes.find(t => t.property === 'scale')?.keyframes || [],
        element.duration,
        'scale'
      ) as Scale;

      const rotation = getPropertyAtTime(
        currentTime,
        element.keyframes.find(t => t.property === 'rotation')?.keyframes || [],
        element.duration,
        'rotation'
      ) as number;

      const opacity = getPropertyAtTime(
        currentTime,
        element.keyframes.find(t => t.property === 'opacity')?.keyframes || [],
        element.duration,
        'opacity'
      ) as number;

      // Validar que todos los valores sean válidos
      if (!position || !scale || typeof rotation !== 'number' || typeof opacity !== 'number') {
        throw new Error('Valores de animación inválidos');
      }

      return { position, scale, rotation, opacity };
    } catch (error) {
      console.error('Error calculando propiedades animadas:', error);
      return {
        position: { x: 0, y: 0 },
        scale: { x: 1, y: 1 },
        rotation: 0,
        opacity: 1
      };
    }
  }, [element.keyframes, currentTime, element.duration]);

  // Validar que el elemento esté dentro del rango de tiempo y sea visible
  if (!element.isVisible || 
      currentTime < element.startTime || 
      currentTime > element.startTime + element.duration ||
      !element.properties) {
    return null;
  }

  const renderContent = () => {
    try {
      switch (element.type) {
        case 'text':
          return (
            <StyledText properties={element.properties}>
              {element.properties.text || ''}
            </StyledText>
          );
        case 'image':
          if (!element.properties.url) {
            console.warn('URL de imagen no proporcionada');
            return null;
          }
          return (
            <StyledImage
              src={element.properties.url}
              alt={element.name}
              onError={(e) => {
                console.error(`Error cargando imagen: ${element.properties.url}`);
                e.currentTarget.style.display = 'none';
              }}
              draggable={false}
            />
          );
        case 'video':
          if (!element.properties.url) {
            console.warn('URL de video no proporcionada');
            return null;
          }
          // TODO: Implementar renderizado de video
          return null;
        default:
          console.warn(`Tipo de elemento no soportado: ${element.type}`);
          return null;
      }
    } catch (error) {
      console.error('Error renderizando contenido:', error);
      return null;
    }
  };

  return (
    <StyledElement
      position={animatedProperties.position}
      scale={animatedProperties.scale}
      rotation={animatedProperties.rotation}
      opacity={animatedProperties.opacity}
      width={element.size.width}
      height={element.size.height}
    >
      {renderContent()}
    </StyledElement>
  );
};

export default ElementRenderer; 