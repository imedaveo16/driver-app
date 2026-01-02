'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Bell, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Mission } from '@/lib/firebase/firestore';

interface MissionAlertProps {
  mission: Mission | null;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  loading?: boolean;
}

export function MissionAlert({ mission, isOpen, onAccept, onDecline, loading }: MissionAlertProps) {
  const [seconds, setSeconds] = useState(30);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setSeconds(30);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onDecline]);

  // Play alert sound
  useEffect(() => {
    if (isOpen) {
      // Try to play a notification sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.warn('Could not play alert sound:', e);
      }
    }
  }, [isOpen]);

  if (!mission) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-500 text-white border-red-400';
      case 'medium':
        return 'bg-orange-500 text-white border-orange-400';
      case 'low':
        return 'bg-emerald-500 text-white border-emerald-400';
      default:
        return 'bg-slate-500 text-white border-slate-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'حرج';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return priority;
    }
  };

  const getMissionTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emergency':
        return 'طوارئ';
      case 'medical':
        return 'طبي';
      case 'fire':
        return 'حريق';
      case 'rescue':
        return 'إنقاذ';
      default:
        return 'آخر';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !loading && onDecline()}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-orange-500/50 text-white p-0 overflow-hidden">
        {/* Header with Alert Bar */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="animate-pulse">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                مهمة جديدة
              </DialogTitle>
              <DialogDescription className="text-orange-100 text-sm mt-1">
                تم تخصيص مهمة جديدة لك
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Mission Details */}
        <div className="p-6 space-y-4">
          {/* Priority & Type Badges */}
          <div className="flex gap-2">
            <Badge className={getPriorityColor(mission.priority) + ' text-sm px-3 py-1'}>
              {getPriorityLabel(mission.priority)}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-sm px-3 py-1">
              {getMissionTypeLabel(mission.type)}
            </Badge>
          </div>

          {/* Mission Description */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <p className="text-white text-base leading-relaxed">
                {mission.description}
              </p>
            </CardContent>
          </Card>

          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-orange-100">
              <MapPin className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">موقع الحادث</div>
                <div className="text-slate-300 text-sm">{mission.location.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-orange-100">
              <Clock className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1">تاريخ البلاغ</div>
                <div className="text-slate-300 text-sm">
                  {new Date(mission.createdAt).toLocaleString('ar-DZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            {mission.reporterPhone && (
              <div className="flex items-start gap-3 text-orange-100">
                <Phone className="w-5 h-5 mt-0.5 text-orange-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">رقم المبلغ</div>
                  <div className="text-slate-300 text-sm">{mission.reporterPhone}</div>
                </div>
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-orange-300 text-sm">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>الرد التلقائي خلال</span>
              <span className="text-2xl font-bold text-white mx-1">{seconds}</span>
              <span>ثانية</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="p-6 pt-0 gap-3">
          <Button
            onClick={onDecline}
            disabled={loading}
            variant="outline"
            className="flex-1 h-12 text-base font-semibold border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            رفض
          </Button>
          <Button
            onClick={onAccept}
            disabled={loading}
            className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border-2 border-green-400/50 shadow-lg shadow-green-600/20"
          >
            {loading ? (
              'جاري القبول...'
            ) : (
              <>
                قبول المهمة
                <ArrowRight className="w-4 h-4 mr-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
