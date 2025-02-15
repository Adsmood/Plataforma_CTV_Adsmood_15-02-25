import React from 'react';
import styled from 'styled-components';
import { VideoEditor } from '../../../components/VideoEditor';
import { useEditorStore } from '../../../stores/editorStore';
import VideoElement from './elements/VideoElement';
import ButtonElement from './elements/ButtonElement';
import CarouselElement from './elements/CarouselElement';
import GalleryElement from './elements/GalleryElement';
import TriviaElement from './elements/TriviaElement';
import QRElement from './elements/QRElement';
import ChoiceElement from './elements/ChoiceElement';
import BackgroundUploader from '../../../components/common/BackgroundUploader';
import ResizableElement from '../../../components/common/ResizableElement';

const elementComponents = {
  video: VideoElement,
  button: ButtonElement,
  carousel: CarouselElement,
  gallery: GalleryElement,
  trivia: TriviaElement,
  qr: QRElement,
  choice: ChoiceElement,
} as const;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background.default};
`;

const Canvas: React.FC = () => {
  const { elements, background, selectedElement, updateElement } = useEditorStore();

  const handleResize = (id: string) => (width: number, height: number) => {
    updateElement(id, {
      size: { width, height },
    });
  };

  const handleDrag = (id: string) => (x: number, y: number) => {
    updateElement(id, {
      position: { x, y },
    });
  };

  return (
    <CanvasContainer>
      {background?.type === 'video' && (
        <VideoEditor
          videoUrl={background.url}
          onVideoChange={(duration) => {
            useEditorStore.getState().updateTimeline({ duration });
          }}
        />
      )}
      <BackgroundUploader />
      
      {elements
        .filter((element) => element.isVisible)
        .map((element) => {
          const Component = elementComponents[element.type as keyof typeof elementComponents];
          if (!Component) return null;

          return (
            <ResizableElement
              key={element.id}
              width={element.size.width}
              height={element.size.height}
              x={element.position.x}
              y={element.position.y}
              onResize={handleResize(element.id)}
              onDrag={handleDrag(element.id)}
              isSelected={selectedElement === element.id}
              aspectRatio={element.type === 'video' ? 16/9 : undefined}
            >
              <Component
                data={element.content}
                isSelected={selectedElement === element.id}
                elementId={element.id}
              />
            </ResizableElement>
          );
        })}
    </CanvasContainer>
  );
};

export default Canvas; 