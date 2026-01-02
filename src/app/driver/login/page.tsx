'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';

export default function DriverLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [driverId, setDriverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !driverId) {
      setError('يرجى إدخال البريد الإلكتروني ورقم التعريف');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Store driver info in localStorage for later use
      localStorage.setItem('driverEmail', email);
      localStorage.setItem('driverId', driverId);

      // Navigate to driver dashboard
      router.push('/driver');
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di0zaC0ydjNoLTN2MmgzdjNoMnYtM2gzdi0yaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-md relative z-10 border-2 border-orange-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-orange-500/10">
        {/* Logo Section */}
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              {/* Civil Protection Badge */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center shadow-2xl border-4 border-orange-400">
                <Shield className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
              {/* Decorative Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-orange-300/30 animate-pulse" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            الحماية المدنية
          </CardTitle>
          <CardDescription className="text-orange-200 text-lg mt-2">
            نظام إدارة العمليات - تطبيق السائق
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-950/50 border-red-500/50 text-red-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-100 block mb-1.5">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-800/50 border-orange-500/30 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 text-lg"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-100 block mb-1.5">
                رقم التعريف
              </label>
              <Input
                type="text"
                placeholder="أدخل رقم تعريف السائق"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="h-12 bg-slate-800/50 border-orange-500/30 text-white placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 text-lg"
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-2 border-orange-400/50 transition-all duration-200 shadow-lg shadow-orange-600/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          {/* Emergency Info */}
          <div className="pt-4 border-t border-orange-500/20">
            <p className="text-xs text-orange-200/70 text-center">
              نظام آمن ومشفّر • الحماية المدنية الجزائرية © 2024
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-20 h-20 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-8 right-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
    </div>
  );
}
