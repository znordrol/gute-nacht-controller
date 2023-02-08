import { useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';

import NoSsr from '../NoSsr';

const VideoComponent = (props: { participantId: string }) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
    props.participantId
  );

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream != null) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(
        (webcamStream as unknown as { track: MediaStreamTrack }).track
      );
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream != null) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(
          (micStream as unknown as { track: MediaStreamTrack }).track
        );

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error('videoElem.current.play() failed', error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <NoSsr>
      <div key={props.participantId}>
        {micOn && micRef && <audio ref={micRef} autoPlay muted={isLocal} />}
        {webcamOn && (
          <ReactPlayer
            //
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={true}
            muted={true}
            playing={true}
            //
            url={videoStream}
            //
            height={'100px'}
            width={'100px'}
            onError={(err) => {
              console.log(err, 'participant video error');
            }}
          />
        )}
      </div>
    </NoSsr>
  );
};

export default VideoComponent;
