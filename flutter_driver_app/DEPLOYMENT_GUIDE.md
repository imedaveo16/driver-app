# 🎉 تطبيق سائق الحماية المدنية - Flutter

تم بناء تطبيق Flutter احترافي كامل للوحدات الميدانية!

---

## ✅ الميزات المنفذة

### 1️⃣ الربط مع مركز القيادة (C2 Integration)
- ✅ Firebase Firestore متكامل
- ✅ استماع فوري لمجموعة `reports`
- ✅ تحديثات لحظية للمهام

### 2️⃣ الميزات الميدانية (Navigation & Logic)
- ✅ زر Google Maps الذكي لفتح الإحداثيات مباشرة
- ✅ أزرار تحديث الحالة اللحظية:
  - 🚑 في الطريق (En Route)
  - 📍 في الموقع (At Scene)
  - ✅ مكتمل (Completed)
- ✅ مزامنة فورية مع منصة التحكم

### 3️⃣ الهوية البصرية الرسمية
- ✅ تصميم Glassmorphism احترافي
- ✅ خطوط Roboto الأنيقة
- ✅ ساعة رقمية في كل الشاشات
- ✅ شعار الحماية المدنية
- ✅ ألوان برتقالية/حمراء على خلفية داكنة

### 4️⃣ البناء والرفع (Deployment)
- ✅ GitHub Actions workflow مهيأ
- ✅ بناء APK تلقائي عند كل push
- ✅ رفع الـ APK كـ artifact

---

## 📂 هيكل المشروع

```
flutter_driver_app/
├── android/                          # إعدادات Android
│   ├── app/
│   │   ├── build.gradle
│   │   ├── google-services.json       # Firebase config (قم باستبداله)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── kotlin/.../MainActivity.kt
│   └── build.gradle
├── .github/workflows/
│   └── build-apk.yml               # GitHub Actions workflow
├── lib/
│   ├── main.dart                    # نقطة الدخول
│   ├── models/
│   │   └── mission.dart            # نموذج المهمة
│   ├── providers/
│   │   ├── auth_provider.dart        # إدارة المصادقة
│   │   └── mission_provider.dart    # إدارة المهام
│   ├── screens/
│   │   ├── splash_screen.dart       # شاشة التحميل
│   │   ├── login_screen.dart        # شاشة تسجيل الدخول
│   │   └── home_screen.dart        # الشاشة الرئيسية
│   ├── services/
│   │   ├── firestore_service.dart    # خدمة Firestore
│   │   └── location_service.dart    # خدمة الموقع
│   └── widgets/
│       ├── mission_card.dart        # بطاقة المهمة
│       └── status_buttons.dart     # أزرار الحالة
├── pubspec.yaml                     # الحزم والتبعيات
└── README.md                        # التوثيق
```

---

## 🚀 كيفية الاستخدام

### الخطوة 1: إعداد Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. أنشئ مشروع جديد أو اختر مشروعك الحالي
3. فعل Firestore Database
4. أضف تطبيق Android:
   - Package name: `com.civilprotection.driver`
   - حمل ملف `google-services.json`

5. **مهم**: استبدل الملف `flutter_driver_app/android/app/google-services.json` بالملف الذي حملته من Firebase

### الخطوة 2: تشغيل التطبيق محلياً

```bash
cd flutter_driver_app
flutter pub get
flutter run
```

### الخطوة 3: بناء APK

**خيار 1: بناء محلي**
```bash
flutter build apk --release
```
الملف سيكون في: `build/app/outputs/flutter-apk/app-release.apk`

**خيار 2: بناء تلقائي عبر GitHub Actions**
تم إعداد workflow تلقائي - عند كل push إلى master/main سيتم بناء APK.

للتحميل الـ APK من GitHub Actions:
1. اذهب إلى: https://github.com/imedaveo16/driver-app/actions
2. انتظر اكتمال الـ workflow
3. في أسفل الصفحة، ستجد Artifacts
4. حمل `Driver_C2_Final`

---

## 🔧 متطلبات Firebase

### المجموعات (Collections) المطلوبة

#### 1. `reports` - المهمات والبلاغات

```javascript
{
  "id": "mission_123",
  "type": "emergency",              // emergency | medical | fire | rescue | other
  "priority": "high",              // high | medium | low
  "description": "حادث مروري طارئ",
  "location": {
    "lat": 36.7538,
    "lng": 3.0588,
    "address": "شارع الاستقلال"
  },
  "status": "pending",              // pending | accepted | en_route | at_scene | completed
  "assignedDriverId": "driver_456",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "reporterName": "محمد أحمد",
  "reporterPhone": "0555123456"
}
```

#### 2. `drivers` - بيانات السائقين

```javascript
{
  "id": "driver_456",
  "name": "السائق",
  "email": "driver@example.com",
  "phone": "0555123456",
  "status": "available",              // available | busy | offline
  "currentLocation": {
    "lat": 36.7538,
    "lng": 3.0588
  },
  "lastLocationUpdate": "2024-01-15T10:30:00Z"
}
```

### قواعد الأمان (Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // السائق يمكن تحديث بياناته
    }
  }
}
```

---

## 📱 استخدام التطبيق

### 1. شاشة التحميل (Splash)
- يظهر شعار الحماية المدنية
- التحقق من حالة المصادقة

### 2. شاشة تسجيل الدخول
- إدخال البريد الإلكتروني ورقم التعريف
- حفظ البيانات محلياً باستخدام Hive
- ساعة رقمية في الأعلى

### 3. الشاشة الرئيسية
- عرض المهام الحالية
- تفاصيل كاملة للمهمة
- زر Google Maps للملاحة
- أزرار تحديث الحالة
- تتبع الموقع الحي

---

## 🔗 التكامل مع منصة التحكم

### إرسال مهمة من المنصة

```javascript
await firebase.firestore().collection('reports').add({
  type: 'emergency',
  priority: 'high',
  description: 'حادث مروري طارئ',
  location: {
    lat: 36.7538,
    lng: 3.0588,
    address: 'شارع الاستقلال'
  },
  status: 'pending',
  assignedDriverId: 'driver_456', // مهم! ID السائق
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
});
```

### مراقبة السائق

```javascript
firebase.firestore()
  .collection('drivers')
  .doc('driver_456')
  .onSnapshot((doc) => {
    const driver = doc.data();
    console.log('Driver location:', driver.currentLocation);
  });
```

---

## 🎨 التصميم

### Glassmorphism UI
- خلفيات شفافة مع blur
- حدود ناعمة مع تباين عالي
- تدرجات لونية جميلة
- ظلال واقعية

### الألوان المستخدمة
- الأساسي: `#FF6B35` (برتقالي)
- الثانوي: `#D62828` (أحمر)
- الخلفية: `#1A1A2E` → `#16213E` (تدرج داكن)
- النص: أبيض مع تباين عالي

### الخطوط
- الأساسي: Roboto
- الساعة: Tabular figures للأرقام

---

## ⚠️ ملاحظات هامة

### 1. Firebase Config
- **مهم**: استبدل ملف `google-services.json` بالملف الحقيقي من Firebase
- تأكد من أن `package_name` في Android يطابق Firebase

### 2. الأذونات
يحتاج التطبيق للأذونات التالية (مُضمنة في AndroidManifest.xml):
- INTERNET
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION

### 3. Google Maps API
- قد تحتاج لإضافة Google Maps API Key في `AndroidManifest.xml` إذا أردت استخدام Google Maps داخل التطبيق

### 4. GitHub Actions
- Workflow سيُشغّل تلقائياً عند كل push
- APK سيُرفع كـ artifact لمدة 30 يوم
- للإصدار الرسمي، استخدم Git tags

---

## 🐛 استكشاف الأخطاء

### المشكلة: التطبيق لا يتصل بـ Firebase

**الحل**:
1. تأكد من أن `google-services.json` صحيح
2. تحقق من إعدادات Firestore
3. تأكد من تفعيل Firestore في Firebase Console

### المشكلة: لا تستقبل المهام

**الحل**:
1. تأكد من أن `assignedDriverId` في المهمة يطابق ID السائق
2. تحقق من Firestore rules
3. تأكد من اتصال الإنترنت

### المشكلة: الموقع لا يعمل

**الحل**:
1. تأكد من منح إذن الموقع في التطبيق
2. تحقق من إعدادات GPS في الجهاز
3. تأكد من Location Permissions في AndroidManifest

### المشكلة: GitHub Actions فشل

**الحل**:
1. تحقق من ملف `build-apk.yml`
2. تأكد من أن Flutter SDK يعمل في CI
3. راجع الـ logs في Actions tab

---

## 📊 حالة المشروع

| العنصر | الحالة |
|---------|--------|
| تطبيق Flutter | ✅ مكتمل |
| Firebase Integration | ✅ منفذ |
| Firestore Service | ✅ منفذ |
| Location Service | ✅ منفذ |
| Glassmorphism UI | ✅ منفذ |
| GitHub Actions | ✅ مهيأ |
| التوثيق | ✅ مكتمل |
| الرفع على GitHub | ✅ مكتمل |

---

## 🚀 الخطوات التالية

### للبناء المحلي:
```bash
cd flutter_driver_app
flutter pub get
flutter build apk --release
```

### للبناء عبر GitHub Actions:
1. تم الرفع بالفعل على GitHub
2. الـ workflow سُيعمل تلقائياً
3. حمل الـ APK من Actions tab

### لنشر على Google Play:
1. استخدم `flutter build appbundle --release`
2. ارفع AAB إلى Google Play Console

---

## 📞 الدعم

للاستفسارات والدعم:
- GitHub Issues: https://github.com/imedaveo16/driver-app/issues
- رابط المستودع: https://github.com/imedaveo16/driver-app

---

## 📄 الترخيص

الحماية المدنية الجزائرية © 2024

---

**تم بناء هذا التطبيق بواسطة Z.ai Code** 🚀
