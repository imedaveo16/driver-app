import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart' show DateFormat;
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import '../models/mission.dart';
import '../providers/auth_provider.dart';
import '../providers/mission_provider.dart';
import '../services/location_service.dart';
import '../widgets/mission_card.dart';
import '../widgets/status_buttons.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  StreamSubscription<Position>? _positionStreamSubscription;
  LocationService _locationService = LocationService();
  String? _currentTime;

  @override
  void initState() {
    super.initState();
    _updateClock();
    Timer.periodic(const Duration(seconds: 1), (_) => _updateClock());

    final authState = ref.read(authProvider);
    if (authState.driverId != null) {
      ref.read(missionProvider.notifier).listenToMissions(authState.driverId!);
      _startLocationTracking(authState.driverId!);
    }
  }

  void _updateClock() {
    setState(() {
      _currentTime = DateFormat('HH:mm:ss').format(DateTime.now());
    });
  }

  void _startLocationTracking(String driverId) async {
    _positionStreamSubscription = _locationService
        .getLocationStream()
        .listen((position) async {
      // Update location in Firestore (implement this)
      print('Location: ${position.lat}, ${position.lng}');
    });
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    super.dispose();
  }

  Future<void> _openGoogleMaps(Mission mission) async {
    final url =
        'https://www.google.com/maps/dir/?api=1&destination=${mission.location.lat},${mission.location.lng}&travelmode=driving';

    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _handleLogout() async {
    await ref.read(authProvider.notifier).logout();
    if (mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final missionState = ref.watch(missionProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(authState),

              // Content
              Expanded(
                child: missionState.isLoading
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xFFFF6B35),
                        ),
                      )
                    : missionState.currentMission == null
                        ? _buildNoMissionView()
                        : _buildMissionView(missionState.currentMission!),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(AuthState authState) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        border: Border(
          bottom: BorderSide(color: Colors.white.withOpacity(0.1)),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo & Title
          Row(
            children: [
              Container(
                width: 45,
                height: 45,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFF6B35), Color(0xFFD62828)],
                  ),
                ),
                child: const Icon(
                  Icons.shield,
                  size: 24,
                  color: Colors.white,
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'السائق',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    authState.email?.split('@')[0] ?? '',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Digital Clock & Logout
          Column(
            children: [
              if (_currentTime != null)
                Text(
                  _currentTime!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontFeatures: [FontFeature.tabularFigures()],
                  ),
                ),
              IconButton(
                icon: const Icon(Icons.logout, color: Color(0xFFFF6B35)),
                onPressed: _handleLogout,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNoMissionView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFFF6B35).withOpacity(0.1),
              ),
              child: const Icon(
                Icons.check_circle_outline,
                size: 50,
                color: Color(0xFFFF6B35),
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'لا توجد مهام نشطة',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            Text(
              'أنت متاح لاستقبال المهام الجديدة',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 16,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionView(Mission mission) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Mission Card
          MissionCard(mission: mission),

          const SizedBox(height: 20),

          // Google Maps Button
          Container(
            width: double.infinity,
            height: 50,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF4285F4).withOpacity(0.5),
                width: 2,
              ),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(12),
                onTap: () => _openGoogleMaps(mission),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.map,
                      color: Color(0xFF4285F4),
                      size: 24,
                    ),
                    SizedBox(width: 8),
                    Text(
                      'فتح في Google Maps',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Status Buttons
          StatusButtons(
            currentStatus: mission.status,
            isUpdating: missionState.isUpdating,
            onStatusChange: (newStatus) {
              ref.read(missionProvider.notifier).updateStatus(mission, newStatus);
            },
          ),
        ],
      ),
    );
  }
}
