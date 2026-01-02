'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { updateDriverLocation } from '@/lib/firebase/firestore';

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

interface UseDriverLocationOptions {
  driverId: string;
  enabled?: boolean;
  updateInterval?: number; // in milliseconds
}

export function useDriverLocation({
  driverId,
  enabled = true,
  updateInterval = 5000, // Update every 5 seconds
}: UseDriverLocationOptions) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = useCallback(async () => {
    if (!enabled || !driverId) return;

    try {
      setError(null);

      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      setIsTracking(true);

      // Watch position for real-time updates
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(newLocation);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(getGeolocationErrorMessage(err.code));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      // Periodically update Firestore
      intervalRef.current = setInterval(async () => {
        if (location) {
          try {
            await updateDriverLocation(driverId, location.lat, location.lng);
          } catch (err) {
            console.error('Failed to update driver location:', err);
          }
        }
      }, updateInterval);

    } catch (err) {
      console.error('Failed to start tracking:', err);
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
      setIsTracking(false);
    }
  }, [driverId, enabled, updateInterval, location]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);
  }, []);

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(newLocation);
          resolve(newLocation);
        },
        (err) => {
          const errorMsg = getGeolocationErrorMessage(err.code);
          setError(errorMsg);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  useEffect(() => {
    if (enabled && driverId) {
      startTracking();
    }

    return () => {
      stopTracking();
    };
  }, [enabled, driverId, startTracking, stopTracking]);

  return {
    location,
    isTracking,
    error,
    startTracking,
    stopTracking,
    getCurrentLocation,
  };
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'تم رفض إذن الوصول للموقع. يرجى تفعيل خدمة الموقع.';
    case 2:
      return 'غير قادر على الحصول على موقعك. يرجى التحقق من إعدادات GPS.';
    case 3:
      return 'انتهت مهلة طلب الموقع. يرجى المحاولة مرة أخرى.';
    default:
      return 'حدث خطأ أثناء الحصول على الموقع';
  }
}

// Utility function to calculate distance between two coordinates (in kilometers)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Utility function to open Google Maps with directions
export function openGoogleMapsDirections(
  destinationLat: number,
  destinationLng: number,
  originLat?: number,
  originLng?: number
): void {
  let url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;

  if (originLat !== undefined && originLng !== undefined) {
    url += `&origin=${originLat},${originLng}`;
  }

  url += '&travelmode=driving';

  window.open(url, '_blank');
}
