import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, onDisconnect, Database } from 'firebase/database';

// Define types for userId and status
type Status = "online" | "offline";
type UserStatus = {
  state: Status;
  lastChanged: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyAXsJuRqbP4mJg4QDE10i90GHfe_5WAaLs",
  authDomain: "chat-application-85b99.firebaseapp.com",
  projectId: "chat-application-85b99",
  storageBucket: "chat-application-85b99.appspot.com",
  messagingSenderId: "795726637096",
  appId: "1:795726637096:web:c5cd333e0319dcff8ded1d",
  measurementId: "G-MP9BQGDXEN"
};

const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app);

// Type annotations for the parameters of the functions
export const setOnlineStatus = (userId: string, status: Status): void => {
  const statusRef = ref(db, `status/${userId}`);
  set(statusRef, {
    state: status,
    lastChanged: new Date().toISOString(),
  });
};

export const listenForStatusChange = (userId: string, callback: (status: Status) => void): void => {
  const statusRef = ref(db, `status/${userId}`);
  onValue(statusRef, (snapshot) => {
    const statusData: UserStatus | null = snapshot.val();
    callback(statusData?.state || "offline");
  });
};

export const setUserOfflineOnDisconnect = (userId: string): void => {
  const statusRef = ref(db, `status/${userId}`);
  onDisconnect(statusRef).set({
    state: "offline",
    lastChanged: new Date().toISOString(),
  });
};

export { db };
