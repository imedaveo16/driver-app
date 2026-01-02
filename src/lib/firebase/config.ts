// Firebase configuration for Civil Protection App
// This should match your Firebase project settings

export const firebaseConfig = {
  // Replace these with your actual Firebase project configuration
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "civil-protection-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Firestore collection names
export const COLLECTIONS = {
  REPORTS: 'reports',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  UNITS: 'units',
} as const;

// Mission status enum
export enum MissionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  ARRIVED = 'arrived',
  RETURNING = 'returning',
  COMPLETED = 'completed',
}

// Mission type enum
export enum MissionType {
  EMERGENCY = 'emergency',
  MEDICAL = 'medical',
  FIRE = 'fire',
  RESCUE = 'rescue',
  OTHER = 'other',
}

// Driver status enum
export enum DriverStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}
