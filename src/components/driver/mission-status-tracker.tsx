'use client';

import { MissionStatus } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Circle, Truck, MapPin, Flag, ArrowRightToLine, Home } from 'lucide-react';

interface StatusStep {
  id: MissionStatus;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STATUS_STEPS: StatusStep[] = [
  {
    id: MissionStatus.ACCEPTED,
    label: 'قبول المهمة',
    icon: Check,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
  },
  {
    id: MissionStatus.EN_ROUTE,
    label: 'في الطريق',
    icon: Truck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
  },
  {
    id: MissionStatus.ARRIVED,
    label: 'وصل إلى الموقع',
    icon: MapPin,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/50',
  },
  {
    id: MissionStatus.RETURNING,
    label: 'العودة للمركز',
    icon: ArrowRightToLine,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
  },
  {
    id: MissionStatus.COMPLETED,
    label: 'اكتملت المهمة',
    icon: Home,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
  },
];

interface MissionStatusTrackerProps {
  currentStatus: MissionStatus;
  onStatusChange: (status: MissionStatus) => Promise<void>;
  disabled?: boolean;
}

export function MissionStatusTracker({ currentStatus, onStatusChange, disabled }: MissionStatusTrackerProps) {
  const currentIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);

  const handleStatusClick = async (status: MissionStatus) => {
    if (disabled) return;
    await onStatusChange(status);
  };

  const isStepCompleted = (index: number) => index < currentIndex;
  const isStepCurrent = (index: number) => index === currentIndex;
  const isStepClickable = (index: number) => {
    // Can only click current step or next step
    return index === currentIndex || index === currentIndex + 1;
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 shadow-2xl shadow-orange-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Flag className="w-5 h-5 text-orange-500" />
          تتبع حالة التدخل
        </h3>
        <div className="text-sm text-orange-200/70">
          الحالة الحالية
        </div>
      </div>

      {/* Status Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-700/50 -z-10 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-full transition-all duration-500"
            style={{
              width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start gap-2">
          {STATUS_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const completed = isStepCompleted(index);
            const current = isStepCurrent(index);
            const clickable = isStepClickable(index);

            return (
              <button
                key={step.id}
                onClick={() => handleStatusClick(step.id)}
                disabled={disabled || !clickable}
                className={cn(
                  'flex flex-col items-center gap-3 relative group transition-all duration-300',
                  clickable && !disabled && 'cursor-pointer',
                  !clickable || disabled && 'cursor-not-allowed opacity-60',
                  clickable && !disabled && 'hover:scale-105'
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative',
                    completed && step.bgColor + ' ' + step.borderColor + ' border-solid',
                    current && 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-400 shadow-lg shadow-orange-500/30 scale-110',
                    !completed && !current && 'bg-slate-800/50 border-slate-600/50'
                  )}
                >
                  {completed ? (
                    <Check className={cn('w-6 h-6', step.color)} />
                  ) : (
                    <StepIcon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        current ? 'text-white' : step.color
                      )}
                    />
                  )}

                  {/* Pulse animation for current step */}
                  {current && (
                    <div
                      className={cn(
                        'absolute inset-0 rounded-full animate-ping opacity-30',
                        step.bgColor
                      )}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div
                  className={cn(
                    'text-xs font-semibold text-center max-w-[70px] leading-tight transition-colors',
                    (completed || current) ? 'text-white' : 'text-slate-400',
                    clickable && !disabled && 'group-hover:text-orange-300'
                  )}
                >
                  {step.label}
                </div>

                {/* Status Indicator */}
                {current && (
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse border-2 border-slate-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Status Text */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-orange-100">
            {STATUS_STEPS[currentIndex]?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
