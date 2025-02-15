import React from 'react';
import styled from 'styled-components';
import { VideoEditor } from '../components/VideoEditor';

const TestContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  background: ${props => props.theme.colors.background.default};
`;

// Video de prueba (reemplazar con una URL real)
const TEST_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const TestEditor: React.FC = () => {
  const handleVideoChange = (duration: number) => {
    console.log('Duración del video:', duration);
  };

  return (
    <TestContainer>
      <VideoEditor
        videoUrl={TEST_VIDEO_URL}
        onVideoChange={handleVideoChange}
      />
    </TestContainer>
  );
};

export default TestEditor; 