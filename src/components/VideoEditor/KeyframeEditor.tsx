import React, { useCallback } from 'react';
import styled from 'styled-components';
import { KeyframeEditorProps, KeyframeTrack, Keyframe, EasingType } from '../../types/timeline';
import { IconButton, Select, MenuItem, Box } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EditorContainer = styled.div`
  background: ${props => props.theme.colors.background.paper};
  border-radius: 4px;
  padding: 16px;
`;

const TrackContainer = styled.div`
  margin-bottom: 16px;
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TrackTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
`;

const KeyframesContainer = styled.div`
  position: relative;
  height: 40px;
  background: ${props => props.theme.colors.background.dark};
  border-radius: 4px;
`;

const KeyframeMarker = styled.div<{ position: number; isSelected: boolean }>`
  position: absolute;
  left: ${props => props.position}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: ${props => props.theme.colors.primary.main};
  border: 2px solid ${props => props.isSelected ? props.theme.colors.primary.light : 'transparent'};
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary.light};
  }
`;

const KeyframeEditor: React.FC<KeyframeEditorProps> = ({
  element,
  onKeyframeChange,
  onKeyframeAdd,
  onKeyframeDelete,
}) => {
  const [selectedKeyframe, setSelectedKeyframe] = React.useState<{
    trackId: string;
    keyframeId: string;
  } | null>(null);

  const handleAddKeyframe = useCallback((trackId: string) => {
    const track = element.keyframes.find(t => t.property === trackId);
    if (!track) return;

    const newKeyframe: Keyframe = {
      time: 0,
      value: trackId === 'position' ? { x: 0, y: 0 } :
             trackId === 'scale' ? { x: 1, y: 1 } :
             trackId === 'rotation' ? 0 : 1,
      easing: 'easeInOut',
    };

    onKeyframeAdd(trackId, newKeyframe);
  }, [element.keyframes, onKeyframeAdd]);

  const handleKeyframeClick = useCallback((trackId: string, keyframeId: string) => {
    setSelectedKeyframe({ trackId, keyframeId });
  }, []);

  const handleEasingChange = useCallback((trackId: string, keyframeId: string, easing: EasingType) => {
    onKeyframeChange(trackId, keyframeId, { easing });
  }, [onKeyframeChange]);

  const handleDeleteKeyframe = useCallback((trackId: string, keyframeId: string) => {
    onKeyframeDelete(trackId, keyframeId);
    if (selectedKeyframe?.trackId === trackId && selectedKeyframe?.keyframeId === keyframeId) {
      setSelectedKeyframe(null);
    }
  }, [onKeyframeDelete, selectedKeyframe]);

  return (
    <EditorContainer>
      {element.keyframes.map((track) => (
        <TrackContainer key={track.property}>
          <TrackHeader>
            <TrackTitle>{track.property}</TrackTitle>
            <IconButton
              size="small"
              onClick={() => handleAddKeyframe(track.property)}
            >
              <AddIcon />
            </IconButton>
          </TrackHeader>

          <KeyframesContainer>
            {track.keyframes.map((keyframe, index) => {
              const position = (keyframe.time / element.duration) * 100;
              const isSelected = selectedKeyframe?.trackId === track.property &&
                               selectedKeyframe?.keyframeId === index.toString();

              return (
                <React.Fragment key={index}>
                  <KeyframeMarker
                    position={position}
                    isSelected={isSelected}
                    onClick={() => handleKeyframeClick(track.property, index.toString())}
                  />
                  {isSelected && (
                    <Box position="absolute" left={`${position}%`} top="100%" mt={1}>
                      <Select
                        size="small"
                        value={keyframe.easing}
                        onChange={(e) => handleEasingChange(track.property, index.toString(), e.target.value as EasingType)}
                      >
                        <MenuItem value="linear">Linear</MenuItem>
                        <MenuItem value="easeInOut">Ease In Out</MenuItem>
                        <MenuItem value="easeIn">Ease In</MenuItem>
                        <MenuItem value="easeOut">Ease Out</MenuItem>
                        <MenuItem value="bounceOut">Bounce Out</MenuItem>
                        <MenuItem value="elasticOut">Elastic Out</MenuItem>
                      </Select>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteKeyframe(track.property, index.toString())}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </React.Fragment>
              );
            })}
          </KeyframesContainer>
        </TrackContainer>
      ))}
    </EditorContainer>
  );
};

export default KeyframeEditor; 