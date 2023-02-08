import { useMeeting } from '@videosdk.live/react-sdk';
import { useState } from 'react';

import NoSsr from '../NoSsr';
import Controls from './Controls';
import VideoComponent from './VideoComponent';

const Container = (props: { meetingId: string }) => {
  const [joined, setJoined] = useState(false);
  const { join } = useMeeting();
  const { participants } = useMeeting();
  const joinMeeting = () => {
    setJoined(true);
    join();
  };

  return (
    <NoSsr>
      <div className='container'>
        <h3>Meeting Id: {props.meetingId}</h3>
        {joined ? (
          <div>
            <Controls />
            {[...participants.keys()].map((participantId) => (
              <VideoComponent
                key={participantId}
                participantId={participantId}
              />
            ))}
          </div>
        ) : (
          <button onClick={joinMeeting}>Join</button>
        )}
      </div>
    </NoSsr>
  );
};

export default Container;
