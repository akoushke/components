import {useEffect, useContext, useState} from 'react';
import {from} from 'rxjs';
import {delayWhen, flatMap, take} from 'rxjs/operators';

import {AdapterContext} from '../../components/';

/**
 * Custom hook that returns meeting data of the given ID.
 * If no ID is given, a `meetingDestination` must be provided to
 * create a new meeting.
 *
 * @param {string} meetingID           ID of the meeting for which to return data.
 * @returns {Meeting} Data of the meeting
 */
export default function useMeeting(meetingID) {
  const [meeting, setMeeting] = useState({});
  const {meetingsAdapter} = useContext(AdapterContext);

  useEffect(() => {
    let subscription;
    const onError = (error) => {
      throw error;
    };
    const onMeeting = (newMeeting) => {
      // console.log('new meeting', newMeeting);

      // React won't recognize the meeting attributes have been updated
      // since the state is the meeting object itself. We need to create a new
      // meeting object trigger the state change
      setMeeting({...newMeeting});
    };
    const onComplete = () => {
      console.log('Completed');

      setMeeting({
        ID: null,
        title: null,
        localAudio: null,
        localVideo: null,
        remoteAudio: null,
        remoteVideo: null,
      });
    };

    if (meetingID !== undefined)
      subscription = meetingsAdapter.getMeeting(meetingID).subscribe(onMeeting, onError, onComplete);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingID]);

  return meeting;
}
