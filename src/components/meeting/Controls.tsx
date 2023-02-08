import { useMeeting } from '@videosdk.live/react-sdk';

import Button from '../buttons/Button';
import NoSsr from '../NoSsr';

const Controls = () => {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <NoSsr>
      <div>
        <Button onClick={leave}>Leave</Button>
        <Button onClick={toggleMic as () => void}>toggleMic</Button>
        <Button onClick={toggleWebcam as () => void}>toggleWebcam</Button>
      </div>
    </NoSsr>
  );
};

export default Controls;
