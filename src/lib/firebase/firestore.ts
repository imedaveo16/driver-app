import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, onSnapshot, updateDoc, setDoc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { firebaseConfig, COLLECTIONS, MissionStatus } from './config';

let db: Firestore | null = null;

export function getFirebaseDB(): Firestore {
  if (!db) {
    const apps = getApps();
    if (apps.length === 0) {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
    } else {
      db = getFirestore(apps[0]);
    }
  }
  return db;
}

export interface Mission {
  id: string;
  type: string;
  priority: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: MissionStatus;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  createdAt: Date;
  updatedAt: Date;
  reporterName?: string;
  reporterPhone?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleId?: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  currentMissionId?: string;
  unitId?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'ambulance' | 'fire_truck' | 'rescue_vehicle';
  status: 'available' | 'busy' | 'maintenance';
  currentDriverId?: string;
  unitId?: string;
}

// Listen to missions for a specific driver
export function listenToDriverMissions(
  driverId: string,
  onUpdate: (missions: Mission[]) => void,
  onError?: (error: Error) => void
): () => void {
  const db = getFirebaseDB();
  const missionsQuery = query(
    collection(db, COLLECTIONS.REPORTS),
    where('assignedDriverId', '==', driverId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    missionsQuery,
    (snapshot) => {
      const missions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Mission[];
      onUpdate(missions);
    },
    (error) => {
      console.error('Error listening to missions:', error);
      onError?.(error);
    }
  );

  return unsubscribe;
}

// Listen to a specific mission
export function listenToMission(
  missionId: string,
  onUpdate: (mission: Mission | null) => void,
  onError?: (error: Error) => void
): () => void {
  const db = getFirebaseDB();
  const missionRef = doc(db, COLLECTIONS.REPORTS, missionId);

  const unsubscribe = onSnapshot(
    missionRef,
    (doc) => {
      if (doc.exists()) {
        onUpdate({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Mission);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Error listening to mission:', error);
      onError?.(error);
    }
  );

  return unsubscribe;
}

// Update mission status
export async function updateMissionStatus(
  missionId: string,
  status: MissionStatus,
  driverId: string
): Promise<void> {
  const db = getFirebaseDB();
  const missionRef = doc(db, COLLECTIONS.REPORTS, missionId);

  await updateDoc(missionRef, {
    status,
    updatedAt: new Date(),
  });
}

// Update driver location
export async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number
): Promise<void> {
  const db = getFirebaseDB();
  const driverRef = doc(db, COLLECTIONS.DRIVERS, driverId);

  await updateDoc(driverRef, {
    currentLocation: { lat, lng },
    lastLocationUpdate: new Date(),
  });
}

// Get driver data
export async function getDriverData(driverId: string): Promise<Driver | null> {
  const db = getFirebaseDB();
  const driverRef = doc(db, COLLECTIONS.DRIVERS, driverId);
  const driverDoc = await getDoc(driverRef);

  if (driverDoc.exists()) {
    return {
      id: driverDoc.id,
      ...driverDoc.data(),
    } as Driver;
  }

  return null;
}

// Update driver status
export async function updateDriverStatus(
  driverId: string,
  status: 'available' | 'busy' | 'offline'
): Promise<void> {
  const db = getFirebaseDB();
  const driverRef = doc(db, COLLECTIONS.DRIVERS, driverId);

  await updateDoc(driverRef, {
    status,
    updatedAt: new Date(),
  });
}
