import { useState } from 'react';

import NoSsr from '../NoSsr';

const JoinScreen = ({
  getMeetingAndToken,
}: {
  getMeetingAndToken: (id: string) => Promise<void>;
}) => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const onClick = async () => {
    if (!meetingId) return;
    await getMeetingAndToken(meetingId);
  };
  return (
    <NoSsr>
      <div>
        <input
          type='text'
          placeholder='Enter Meeting Id'
          onChange={(e) => {
            setMeetingId(e.target.value);
          }}
        />
        <button onClick={onClick}>Join</button>
        {' or '}
        <button onClick={onClick}>Create Meeting</button>
      </div>
    </NoSsr>
  );
};

export default JoinScreen;
