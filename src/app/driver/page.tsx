'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MissionMap } from '@/components/driver/mission-map';
import { MissionStatusTracker } from '@/components/driver/mission-status-tracker';
import { MissionAlert } from '@/components/driver/mission-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDriverLocation, openGoogleMapsDirections, calculateDistance } from '@/hooks/use-driver-location';
import { listenToDriverMissions, updateMissionStatus, Mission, MissionStatus } from '@/lib/firebase/firestore';
import {
  Menu,
  MapIcon,
  LogOut,
  AlertCircle,
  Loader2,
  Navigation,
  Shield,
  Wifi,
  WifiOff,
  MapPin,
} from 'lucide-react';

export default function DriverDashboard() {
  const router = useRouter();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [driverName, setDriverName] = useState<string>('');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showMissionAlert, setShowMissionAlert] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // Driver location tracking
  const { location, isTracking, error: locationError } = useDriverLocation({
    driverId: driverId || '',
    enabled: !!driverId && !!currentMission,
    updateInterval: 5000,
  });

  // Initialize driver data
  useEffect(() => {
    const storedDriverId = localStorage.getItem('driverId');
    const storedEmail = localStorage.getItem('driverEmail');

    if (!storedDriverId || !storedEmail) {
      router.push('/driver/login');
      return;
    }

    setDriverId(storedDriverId);
    setDriverName(storedEmail.split('@')[0]);
  }, [router]);

  // Listen to driver missions
  useEffect(() => {
    if (!driverId) return;

    setLoading(true);

    const unsubscribe = listenToDriverMissions(
      driverId,
      (missionsList) => {
        setMissions(missionsList);

        // Find pending or active mission
        const pendingMission = missionsList.find(m =>
          m.status === MissionStatus.PENDING
        );

        const activeMission = missionsList.find(m =>
          m.assignedDriverId === driverId &&
          m.status !== MissionStatus.PENDING &&
          m.status !== MissionStatus.COMPLETED
        );

        if (pendingMission && !currentMission) {
          setCurrentMission(pendingMission);
          setShowMissionAlert(true);
        } else if (activeMission) {
          setCurrentMission(activeMission);
          setShowMissionAlert(false);
        }

        setLoading(false);
        setConnectionStatus('connected');
      },
      (error) => {
        console.error('Error listening to missions:', error);
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [driverId, currentMission]);

  // Handle mission status change
  const handleStatusChange = async (status: MissionStatus) => {
    if (!currentMission || !driverId || statusLoading) return;

    setStatusLoading(true);

    try {
      await updateMissionStatus(currentMission.id, status, driverId);

      // Update current mission status
      setCurrentMission({
        ...currentMission,
        status,
        updatedAt: new Date(),
      });

      // If mission is completed, clear it
      if (status === MissionStatus.COMPLETED) {
        setCurrentMission(null);
      }
    } catch (error) {
      console.error('Error updating mission status:', error);
      alert('حدث خطأ أثناء تحديث حالة المهمة');
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle accepting mission
  const handleAcceptMission = async () => {
    if (!currentMission || !driverId) return;

    try {
      await updateMissionStatus(currentMission.id, MissionStatus.ACCEPTED, driverId);
      setShowMissionAlert(false);
    } catch (error) {
      console.error('Error accepting mission:', error);
      alert('حدث خطأ أثناء قبول المهمة');
    }
  };

  // Handle declining mission
  const handleDeclineMission = () => {
    setShowMissionAlert(false);
    setCurrentMission(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('driverId');
    localStorage.removeItem('driverEmail');
    router.push('/driver/login');
  };

  // Calculate distance to incident
  const distanceToIncident = location && currentMission
    ? calculateDistance(
        location.lat,
        location.lng,
        currentMission.location.lat,
        currentMission.location.lng
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-orange-200 text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">السائق</h1>
                <p className="text-xs text-orange-200/70">{driverName}</p>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-slate-300">
                  {connectionStatus === 'connected' ? 'متصل' : 'غير متصل'}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-400 hover:text-orange-400 hover:bg-orange-500/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 space-y-4">
        {/* No Active Mission */}
        {!currentMission && missions.length === 0 && (
          <Card className="border-2 border-orange-500/20 bg-slate-900/50">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                لا توجد مهام نشطة
              </h3>
              <p className="text-slate-400 max-w-md">
                أنت متاح لاستقبال المهام الجديدة. سيتم إعلامك فور وصول مهمة جديدة.
              </p>
              {isTracking && (
                <Badge className="mt-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                  الموقع مفعل
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Mission */}
        {currentMission && (
          <>
            {/* Mission Info Card */}
            <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-orange-500" />
                      مهمة نشطة
                    </CardTitle>
                    <CardDescription className="text-orange-200/70 mt-1">
                      تتبع وتنفيذ المهمة المخصصة لك
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/50">
                    {currentMission.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Mission Description */}
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                  <p className="text-white text-sm leading-relaxed">
                    {currentMission.description}
                  </p>
                </div>

                {/* Distance & Location */}
                {distanceToIncident !== null && (
                  <div className="flex items-center gap-3 bg-orange-600/10 rounded-lg p-3 border border-orange-500/20">
                    <Navigation className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-orange-200/70 mb-0.5">المسافة المتبقية</div>
                      <div className="text-lg font-bold text-white">
                        {distanceToIncident.toFixed(1)} كم
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        openGoogleMapsDirections(
                          currentMission.location.lat,
                          currentMission.location.lng,
                          location?.lat,
                          location?.lng
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      Google Maps
                    </Button>
                  </div>
                )}

                {/* Location Address */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="text-slate-300 flex-1">
                    {currentMission.location.address}
                  </div>
                </div>

                {/* Reporter Info */}
                {currentMission.reporterPhone && (
                  <div className="flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-slate-300 flex-1">
                      {currentMission.reporterName && (
                        <span className="font-semibold">{currentMission.reporterName} - </span>
                      )}
                      {currentMission.reporterPhone}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mission Map */}
            <MissionMap
              incidentLocation={currentMission.location}
              driverLocation={location || undefined}
              height="300px"
            />

            {/* Status Tracker */}
            <MissionStatusTracker
              currentStatus={currentMission.status}
              onStatusChange={handleStatusChange}
              disabled={statusLoading}
            />
          </>
        )}
      </main>

      {/* Mission Alert Dialog */}
      <MissionAlert
        mission={currentMission}
        isOpen={showMissionAlert}
        onAccept={handleAcceptMission}
        onDecline={handleDeclineMission}
        loading={statusLoading}
      />

      {/* Location Error Alert */}
      {locationError && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
          <Card className="bg-red-950/95 backdrop-blur-xl border-2 border-red-500/50 text-white">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm">خطأ في الموقع</div>
                <div className="text-xs text-red-200/80 mt-1">{locationError}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
