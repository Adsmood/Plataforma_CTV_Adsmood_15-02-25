import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { IconButton, Slider, Box } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${props => props.theme.colors.background.dark};
  border-radius: 8px;
  overflow: hidden;
`;

const PlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
`;

const StyledReactPlayer = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface VideoPreviewProps {
  url: string;
  onTimeUpdate?: (time: number) => void;
  onDuration?: (duration: number) => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  url,
  onTimeUpdate,
  onDuration,
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    setMuted(newValue as number === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeekChange = (_: Event, newValue: number | number[]) => {
    setPlayed(newValue as number);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (_: Event, newValue: number | number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue as number);
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      onTimeUpdate?.(state.playedSeconds);
    }
  };

  return (
    <PreviewContainer>
      <PlayerWrapper>
        <StyledReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={onDuration}
          progressInterval={100}
        />
      </PlayerWrapper>
      <Controls>
        <IconButton onClick={handlePlayPause} size="small" sx={{ color: 'white' }}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        
        <Box sx={{ width: '100%', mx: 2 }}>
          <Slider
            value={played}
            onChange={handleSeekChange}
            onMouseDown={handleSeekMouseDown}
            onChangeCommitted={handleSeekMouseUp}
            min={0}
            max={1}
            step={0.001}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
            }}
          />
        </Box>
        
        <IconButton onClick={handleToggleMute} size="small" sx={{ color: 'white' }}>
          {muted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        
        <Box sx={{ width: 100 }}>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
            }}
          />
        </Box>
      </Controls>
    </PreviewContainer>
  );
};

export default VideoPreview; 