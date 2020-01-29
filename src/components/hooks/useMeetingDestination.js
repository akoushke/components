import {useEffect, useContext, useState} from 'react';
import {from} from 'rxjs';
import {delayWhen, flatMap, take} from 'rxjs/operators';

import {AdapterContext} from '../../components/';

/**
 * Custom hook that returns meeting data of the given ID.
 * If no ID is given, a `meetingDestination` must be provided to
 * create a new meeting.
 *
 * @param {string} meetingDestination  Virtual location where the meeting should take place.
 * @returns {Meeting} Data of the meeting
 */
export default function useMeetingDestination(meetingDestination) {
  const [ID, setID] = useState({});
  const {meetingsAdapter} = useContext(AdapterContext);

  useEffect(() => {
    const onError = (error) => {
      throw error;
    };

    // Create a meeting, start event listeners by subscribing to getMeeting,
    // wait for local media to get added and complete
    const subscription = meetingsAdapter.createMeeting(meetingDestination).subscribe(setID, onError);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ID;
}
