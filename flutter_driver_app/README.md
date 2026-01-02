# Civil Protection Driver App

تطبيق سائق الحماية المدنية - تطبيق احترافي للوحدات الميدانية باستخدام Flutter.

## الميزات

✅ **استقبال المهام الحية**
- استماع فوري لمجموعة `reports` في Firestore
- تنبيهات فورية عند وصول مهام جديدة
- عرض تفاصيل الحادث بشكل واضح

✅ **الملاحة الذكية**
- زر Google Maps الذكي لفتح الإحداثيات مباشرة
- عرض العنوان والإحداثيات بدقة
- دعم التنقل أثناء القيادة

✅ **تحديث الحالة اللحظي**
- أزرار تحديث الحالة: في الطريق 🚑 → في الموقع 📍 → مكتمل ✅
- مزامنة فورية مع منصة التحكم
- تتبع دقيق لحالة كل مهمة

✅ **تصميم احترافي**
- Glassmorphism UI مع شفافية أنيقة
- خطوط Roboto الأنيقة
- ساعة رقمية علوية
- تصميم متجاوب للأجهزة المختلفة

✅ **Firebase Integration**
- ربط كامل مع Firestore
- تحديثات فورية للموقع والحالة
- دعم Push Notifications

## التقنيات المستخدمة

- **Framework**: Flutter 3.0+
- **State Management**: Riverpod
- **Backend**: Firebase Firestore
- **Maps**: Google Maps Flutter
- **Location**: Geolocator
- **UI**: Material Design 3 + Glassmorphism

## التثبيت

### المتطلبات
- Flutter SDK 3.0 أو أحدث
- Android Studio / VS Code
- حساب Firebase

### خطوات التثبيت

1. استنساخ المشروع:
```bash
git clone https://github.com/imedaveo16/driver-app.git
cd driver-app/flutter_driver_app
```

2. تثبيت الحزم:
```bash
flutter pub get
```

3. إعداد Firebase:
- ضع ملف `google-services.json` في `flutter_driver_app/android/app/`
- تأكد من تفعيل Firestore Database

4. تشغيل التطبيق:
```bash
flutter run
```

## البناء

### بناء APK للإصدار

```bash
flutter build apk --release
```

الملف سيكون في: `build/app/outputs/flutter-apk/app-release.apk`

### بناء App Bundle للGoogle Play

```bash
flutter build appbundle --release
```

## هيكل المشروع

```
lib/
├── models/          # نماذج البيانات
│   └── mission.dart
├── services/        # الخدمات
│   ├── firestore_service.dart
│   └── location_service.dart
├── providers/       # State Management
│   ├── auth_provider.dart
│   └── mission_provider.dart
├── screens/         # الشاشات
│   ├── splash_screen.dart
│   ├── login_screen.dart
│   └── home_screen.dart
└── widgets/        # المكونات
    ├── mission_card.dart
    └── status_buttons.dart
```

## GitHub Actions

يتم بناء APK تلقائياً عند كل push على branch master/main.

الملف يُرفع كـ artifact باسم: `Driver_C2_Final`

## الملاحظات

- تأكد من تفعيل إذن الموقع (Location Permission)
- يُفضل استخدام APK في وضع الإنتاج
- Firebase credentials يجب أن تكون صحيحة

## الدعم

للدعم والاستفسارات، يرجى فتح issue في GitHub.

## الترخيص

الحماية المدنية الجزائرية © 2024
