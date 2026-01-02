# دليل التكامل: تطبيق السائق ↔ منصة التحكم (C.C.O)

## نظرة عامة

هذا الدليل يشرح كيفية ربط تطبيق السائق بمنصة التحكم (C.C.O) لإدارة المهام وتتبع السائقين.

---

## 1. هيكل قاعدة البيانات

### المجموعات (Collections)

```javascript
reports      // المهمات والبلاغات
drivers      // بيانات السائقين
vehicles     // المركبات
units        // الوحدات
```

---

## 2. إرسال مهمة من منصة التحكم

### إنشاء مهمة جديدة

```javascript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

async function createMission(missionData) {
  const missionId = `mission_${Date.now()}`;

  await setDoc(doc(db, 'reports', missionId), {
    ...missionData,
    id: missionId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return missionId;
}

// مثال على الاستخدام
const mission = await createMission({
  type: 'emergency',              // emergency | medical | fire | rescue | other
  priority: 'high',              // high | medium | low
  description: 'حادث مروري طارئ في الشارع الرئيسي',
  location: {
    lat: 36.7538,
    lng: 3.0588,
    address: 'شارع الاستقلال، الجزائر العاصمة'
  },
  status: 'pending',              // pending | accepted | en_route | arrived | returning | completed
  assignedDriverId: 'driver_123', // ID السائق المخصص
  assignedVehicleId: 'ambulance_456', // ID المركبة
  reporterName: 'محمد أحمد',
  reporterPhone: '0555123456',
});
```

---

## 3. تخصيص السائق للمهمة

### الطريقة 1: عند إنشاء المهمة

```javascript
const mission = await createMission({
  // ... بيانات المهمة
  assignedDriverId: selectedDriverId, // السائق المختار
});
```

### الطريقة 2: تحديث مهمة موجودة

```javascript
import { updateDoc, doc } from 'firebase/firestore';

async function assignDriverToMission(missionId, driverId) {
  await updateDoc(doc(db, 'reports', missionId), {
    assignedDriverId: driverId,
    status: 'pending', // إعادة تعيين الحالة لانتظار القبول
    updatedAt: serverTimestamp(),
  });
}
```

---

## 4. مراقبة السائقين على الخريطة

### عرض موقع السائق الحي

```javascript
import { doc, onSnapshot } from 'firebase/firestore';

// تتبع سائق واحد
function trackDriver(driverId, onLocationUpdate) {
  const unsubscribe = onSnapshot(
    doc(db, 'drivers', driverId),
    (doc) => {
      if (doc.exists()) {
        const driver = doc.data();
        onLocationUpdate({
          id: doc.id,
          name: driver.name,
          location: driver.currentLocation,
          status: driver.status,
          lastUpdate: driver.lastLocationUpdate,
        });
      }
    }
  );

  return unsubscribe; // لإيقاف الاستماع
}

// مثال على الاستخدام
const unsubscribe = trackDriver('driver_123', (driver) => {
  console.log('Driver location:', driver.location);
  // تحديث الخريطة
  mapDriverMarker(driver);
});

// إيقاف التتبع
// unsubscribe();
```

### تتبع جميع السائقين

```javascript
import { collection, onSnapshot, query, where } from 'firebase/firestore';

function trackAllDrivers(onDriversUpdate) {
  const q = query(
    collection(db, 'drivers'),
    where('status', '!=', 'offline')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const drivers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    onDriversUpdate(drivers);
  });

  return unsubscribe;
}
```

---

## 5. مراقبة حالة المهمة

### الاستماع لتحديثات المهمة

```javascript
import { doc, onSnapshot } from 'firebase/firestore';

function trackMission(missionId, onStatusChange) {
  const unsubscribe = onSnapshot(
    doc(db, 'reports', missionId),
    (doc) => {
      if (doc.exists()) {
        const mission = doc.data();
        onStatusChange(mission);
      }
    }
  );

  return unsubscribe;
}

// مثال على الاستخدام
trackMission('mission_123', (mission) => {
  console.log('Mission status:', mission.status);

  // تحديث واجهة المستخدم بناءً على الحالة
  switch (mission.status) {
    case 'pending':
      showStatus('في الانتظار');
      break;
    case 'en_route':
      showStatus('في الطريق');
      break;
    case 'arrived':
      showStatus('وصل للموقع');
      break;
    case 'completed':
      showStatus('اكتملت');
      break;
  }
});
```

---

## 6. عرض السائقين المتاحين

### الحصول على السائقين المتاحين

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';

async function getAvailableDrivers() {
  const q = query(
    collection(db, 'drivers'),
    where('status', '==', 'available')
  );

  const snapshot = await getDocs(q);
  const drivers = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return drivers;
}

// الاستخدام في منصة التحكم
const availableDrivers = await getAvailableDrivers();
```

---

## 7. حساب المسافة للسائق

```javascript
// حساب المسافة بين موقعين (بالكيلومتر)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
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

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// البحث عن أقرب سائق
async function findClosestDriver(incidentLat, incidentLng) {
  const drivers = await getAvailableDrivers();
  const driverDistances = drivers.map(driver => {
    const distance = driver.currentLocation
      ? calculateDistance(
          driver.currentLocation.lat,
          driver.currentLocation.lng,
          incidentLat,
          incidentLng
        )
      : Infinity;

    return {
      driver,
      distance,
    };
  });

  // ترتيب حسب المسافة
  driverDistances.sort((a, b) => a.distance - b.distance);

  return driverDistances[0]?.driver || null;
}
```

---

## 8. أمثلة عمليات كاملة

### سيناريو 1: استقبال بلاغ وإرسال مهمة

```javascript
async function handleIncomingReport(reportData) {
  // 1. إنشاء مهمة
  const missionId = await createMission({
    type: reportData.type,
    priority: reportData.priority,
    description: reportData.description,
    location: reportData.location,
    status: 'pending',
  });

  // 2. البحث عن أقرب سائق
  const closestDriver = await findClosestDriver(
    reportData.location.lat,
    reportData.location.lng
  );

  if (closestDriver) {
    // 3. تخصيص السائق
    await updateDoc(doc(db, 'reports', missionId), {
      assignedDriverId: closestDriver.id,
    });

    // 4. تحديث حالة السائق
    await updateDoc(doc(db, 'drivers', closestDriver.id), {
      status: 'busy',
      currentMissionId: missionId,
    });

    console.log(`Mission ${missionId} assigned to driver ${closestDriver.name}`);
  } else {
    console.log('No available drivers');
  }
}
```

### سيناريو 2: مراقبة المهمة حتى الاكتمال

```javascript
function monitorMission(missionId) {
  const unsubscribe = trackMission(missionId, (mission) => {
    updateDashboard(mission);

    if (mission.status === 'completed') {
      // إلغاء الاستماع عند اكتمال المهمة
      unsubscribe();

      // تحرير السائق
      if (mission.assignedDriverId) {
        updateDoc(doc(db, 'drivers', mission.assignedDriverId), {
          status: 'available',
          currentMissionId: null,
        });
      }
    }
  });
}
```

---

## 9. قواعد أمان Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السائقين يمكنهم قراءة/كتابة بياناتهم الخاصة
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == driverId;
    }

    // منصة التحكم يمكنها قراءة/كتابة كل شيء
    match /reports/{reportId} {
      allow read, write: if request.auth != null;
    }

    // المركبات
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth != null;
    }

    // الوحدات
    match /units/{unitId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 10. واجهة برمجة التطبيقات (API Summary)

### دوال التطبيق الرئيسية

| الدالة | الوصف | المعاملات |
|--------|-------|----------|
| `createMission()` | إنشاء مهمة جديدة | missionData |
| `assignDriverToMission()` | تخصيص سائق لمهمة | missionId, driverId |
| `trackDriver()` | تتبع موقع سائق | driverId, callback |
| `trackAllDrivers()` | تتبع جميع السائقين | callback |
| `trackMission()` | مراقبة حالة مهمة | missionId, callback |
| `getAvailableDrivers()` | الحصول على السائقين المتاحين | - |
| `findClosestDriver()` | البحث عن أقرب سائق | lat, lng |

---

## 11. نصائح مهمة

### 1. التعامل مع الحالات
- دائماً تحقق من الحالة قبل تخصيص سائق
- حرر السائق عند اكتمال المهمة

### 2. تحديثات الموقع
- السائق يحدّث موقعه كل 5 ثوانٍ
- استخدم onSnapshot للحصول على التحديثات الحية

### 3. معالجة الأخطاء
- استخدم try-catch للتعامل مع أخطاء Firestore
- اعرض رسائل واضحة للمستخدم

### 4. الأداء
- استخدم query filtering لتقليل البيانات
- إلغاء الاستماع (unsubscribe) عند عدم الحاجة

---

## 12. استكشاف الأخطاء

### السائق لا يستلم المهمة
- تأكد من `assignedDriverId` في المهمة
- تحقق من أن السائق متصل

### الموقع لا يُحدّث
- تأكد من إذن الموقع في المتصفح
- تحقق من Firebase connection

### الحالة لا تُحدّث
- تحقق من Firestore rules
- تأكد من صلاحيات الكتابة

---

**للمزيد من المعلومات، راجع [دليل الاستخدام الكامل](./DRIVER_APP_GUIDE.md)**
