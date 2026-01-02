'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di0zaC0ydjNoLTN2MmgzdjNoMnYtM2gzdi0yaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Civil Protection Badge */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center shadow-2xl border-4 border-orange-400">
                <Shield className="w-20 h-20 text-white" strokeWidth={2} />
              </div>
              {/* Decorative Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-orange-300/30 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white tracking-tight mb-3">
            الحماية المدنية
          </h1>
          <p className="text-orange-200 text-xl">
            نظام إدارة العمليات والقيادة والسيطرة
          </p>
        </div>

        {/* App Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver App Card */}
          <Card className="border-2 border-orange-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-orange-500/10 hover:border-orange-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                تطبيق السائق
              </CardTitle>
              <CardDescription className="text-orange-200/80 text-base mt-2">
                تطبيق السائقين وفرق التدخل
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-slate-300 space-y-2 text-right">
                <li>• استقبال المهام في الوقت الحقيقي</li>
                <li>• الملاحة الذكية للموقع</li>
                <li>• تحديث حالة التدخل</li>
                <li>• تتبع الموقع الحي</li>
              </ul>
              <Button
                onClick={() => router.push('/driver/login')}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-2 border-orange-400/50 transition-all duration-200 shadow-lg shadow-orange-600/20"
              >
                دخول التطبيق
              </Button>
            </CardContent>
          </Card>

          {/* Command Center Card */}
          <Card className="border-2 border-blue-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                منصة التحكم
              </CardTitle>
              <CardDescription className="text-blue-200/80 text-base mt-2">
                نظام القيادة والسيطرة (C.C.O)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-slate-300 space-y-2 text-right">
                <li>• إدارة البلاغات والمهام</li>
                <li>• تخصيص الوحدات للمهام</li>
                <li>• تتبع السائقين على الخريطة</li>
                <li>• إحصائيات وتقارير شاملة</li>
              </ul>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-2 border-blue-400/50 transition-all duration-200 shadow-lg shadow-blue-600/20"
              >
                دخول المنصة
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-xs text-slate-500">
            نظام آمن ومشفّر • الحماية المدنية الجزائرية © 2024
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-20 h-20 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-8 right-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-8 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
}
