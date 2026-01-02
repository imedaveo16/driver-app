import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  final GeolocatorPlatform _geolocator = GeolocatorPlatform.instance;

  Future<bool> checkPermissions() async {
    final permission = await Permission.locationWhenInUse.status;
    if (permission.isGranted) return true;

    final result = await Permission.locationWhenInUse.request();
    return result.isGranted;
  }

  Future<LocationPosition?> getCurrentLocation() async {
    try {
      final hasPermission = await checkPermissions();
      if (!hasPermission) return null;

      final position = await _geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      return LocationPosition(
        lat: position.latitude,
        lng: position.longitude,
        accuracy: position.accuracy,
      );
    } catch (e) {
      print('Error getting location: $e');
      return null;
    }
  }

  Stream<LocationPosition> getLocationStream() {
    final locationSettings = const LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10,
    );

    return _geolocator.getPositionStream(locationSettings).map(
      (position) => LocationPosition(
        lat: position.latitude,
        lng: position.longitude,
        accuracy: position.accuracy,
      ),
    );
  }
}

class LocationPosition {
  final double lat;
  final double lng;
  final double? accuracy;

  LocationPosition({
    required this.lat,
    required this.lng,
    this.accuracy,
  });
}
