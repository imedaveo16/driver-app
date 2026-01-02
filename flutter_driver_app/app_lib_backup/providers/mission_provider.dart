import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/mission.dart';
import '../services/firestore_service.dart';

class MissionNotifier extends StateNotifier<MissionState> {
  final FirestoreService _firestoreService = FirestoreService();

  MissionNotifier() : super(MissionState.initial());

  void listenToMissions(String driverId) {
    _firestoreService.listenToDriverMissions(driverId).listen((missions) {
      final activeMission = missions.firstWhere(
        (m) => m.status != MissionStatus.completed,
        orElse: () => missions.isEmpty
            ? null!
            : missions.first,
      );

      state = MissionState.loaded(
        missions: missions,
        currentMission: missions.isEmpty ? null : activeMission,
      );
    });
  }

  Future<void> updateStatus(Mission mission, MissionStatus newStatus) async {
    state = state.copyWith(isUpdating: true);

    try {
      await _firestoreService.updateMissionStatus(
        mission.id,
        newStatus == MissionStatus.enRoute
            ? 'en_route'
            : newStatus == MissionStatus.atScene
                ? 'at_scene'
                : 'completed',
      );

      // Update local state
      if (state.currentMission?.id == mission.id) {
        state = MissionState.loaded(
          missions: state.missions.map((m) {
            if (m.id == mission.id) {
              return Mission(
                id: m.id,
                type: m.type,
                priority: m.priority,
                description: m.description,
                location: m.location,
                status: newStatus,
                assignedDriverId: m.assignedDriverId,
                createdAt: m.createdAt,
                updatedAt: DateTime.now(),
                reporterName: m.reporterName,
                reporterPhone: m.reporterPhone,
              );
            }
            return m;
          }).toList(),
          currentMission: Mission(
            id: mission.id,
            type: mission.type,
            priority: mission.priority,
            description: mission.description,
            location: mission.location,
            status: newStatus,
            assignedDriverId: mission.assignedDriverId,
            createdAt: mission.createdAt,
            updatedAt: DateTime.now(),
            reporterName: mission.reporterName,
            reporterPhone: mission.reporterPhone,
          ),
          isUpdating: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        isUpdating: false,
        error: 'فشل تحديث الحالة: $e',
      );
    }
  }
}

class MissionState {
  final List<Mission> missions;
  final Mission? currentMission;
  final bool isLoading;
  final bool isUpdating;
  final String? error;

  MissionState({
    required this.missions,
    this.currentMission,
    this.isLoading = false,
    this.isUpdating = false,
    this.error,
  });

  factory MissionState.initial() {
    return MissionState(missions: [], isLoading: true);
  }

  factory MissionState.loaded({
    required List<Mission> missions,
    Mission? currentMission,
    bool isUpdating = false,
    String? error,
  }) {
    return MissionState(
      missions: missions,
      currentMission: currentMission,
      isLoading: false,
      isUpdating: isUpdating,
      error: error,
    );
  }

  MissionState copyWith({
    List<Mission>? missions,
    Mission? currentMission,
    bool? isLoading,
    bool? isUpdating,
    String? error,
  }) {
    return MissionState(
      missions: missions ?? this.missions,
      currentMission: currentMission ?? this.currentMission,
      isLoading: isLoading ?? this.isLoading,
      isUpdating: isUpdating ?? this.isUpdating,
      error: error,
    );
  }
}

final missionProvider =
    StateNotifierProvider<MissionNotifier, MissionState>((ref) => MissionNotifier());
