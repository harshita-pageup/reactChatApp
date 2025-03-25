import { useState, useEffect } from 'react';
import { Database, ref, onValue, set, onDisconnect, DatabaseReference } from 'firebase/database';

const usePresence = (userId: string | null): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const userStatusRef: DatabaseReference = ref(Database, `/status/${userId}`);

    // Set online status on connect
    const connectedRef: DatabaseReference = ref(Database, '.info/connected');
    const connectedListener = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        set(userStatusRef, true);
        onDisconnect(userStatusRef).set(false); // Set offline on disconnect
      }
    });

    // Listen for online status changes
    const statusListener = onValue(userStatusRef, (snapshot) => {
      setIsOnline(snapshot.val() === true);
    });

    return () => {
      // Detach listeners
      connectedListener(); // Detach the connected listener
      statusListener(); // Detach the status listener
    };
  }, [userId]);

  return isOnline;
};

export default usePresence;
