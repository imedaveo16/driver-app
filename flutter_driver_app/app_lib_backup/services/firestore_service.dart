import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/mission.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<List<Mission>> listenToDriverMissions(String driverId) {
    return _firestore
        .collection('reports')
        .where('assignedDriverId', isEqualTo: driverId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Mission.fromJson({...doc.data(), 'id': doc.id}))
            .toList());
  }

  Stream<Mission?> listenToMission(String missionId) {
    return _firestore
        .collection('reports')
        .doc(missionId)
        .snapshots()
        .map((snapshot) {
      if (!snapshot.exists) return null;
      return Mission.fromJson({...snapshot.data()!, 'id': snapshot.id});
    });
  }

  Future<void> updateMissionStatus(
    String missionId,
    String status,
  ) async {
    await _firestore.collection('reports').doc(missionId).update({
      'status': status,
      'updatedAt': DateTime.now(),
    });
  }

  Future<void> updateDriverLocation(
    String driverId,
    double lat,
    double lng,
  ) async {
    await _firestore.collection('drivers').doc(driverId).update({
      'currentLocation': {'lat': lat, 'lng': lng},
      'lastLocationUpdate': DateTime.now(),
    });
  }

  Future<Map<String, dynamic>?> getDriverData(String driverId) async {
    final doc = await _firestore.collection('drivers').doc(driverId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  Future<void> updateDriverStatus(
    String driverId,
    String status,
  ) async {
    await _firestore.collection('drivers').doc(driverId).update({
      'status': status,
      'updatedAt': DateTime.now(),
    });
  }
}
