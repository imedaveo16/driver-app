import 'package:flutter/material.dart';
import '../models/mission.dart';

class StatusButtons extends StatelessWidget {
  final MissionStatus currentStatus;
  final bool isUpdating;
  final Function(MissionStatus) onStatusChange;

  const StatusButtons({
    super.key,
    required this.currentStatus,
    required this.isUpdating,
    required this.onStatusChange,
  });

  bool _isStatusEnabled(MissionStatus status) {
    switch (status) {
      case MissionStatus.enRoute:
        return currentStatus == MissionStatus.accepted ||
            currentStatus == MissionStatus.pending;
      case MissionStatus.atScene:
        return currentStatus == MissionStatus.enRoute;
      case MissionStatus.completed:
        return currentStatus == MissionStatus.atScene;
      default:
        return false;
    }
  }

  Color _getStatusColor(MissionStatus status) {
    switch (status) {
      case MissionStatus.enRoute:
        return const Color(0xFF2196F3);
      case MissionStatus.atScene:
        return const Color(0xFFFF6B35);
      case MissionStatus.completed:
        return const Color(0xFF4CAF50);
      default:
        return Colors.grey;
    }
  }

  String _getStatusText(MissionStatus status) {
    switch (status) {
      case MissionStatus.enRoute:
        return 'في الطريق';
      case MissionStatus.atScene:
        return 'في الموقع';
      case MissionStatus.completed:
        return 'مكتمل';
      default:
        return '';
    }
  }

  IconData _getStatusIcon(MissionStatus status) {
    switch (status) {
      case MissionStatus.enRoute:
        return Icons.directions_car;
      case MissionStatus.atScene:
        return Icons.location_on;
      case MissionStatus.completed:
        return Icons.check_circle;
      default:
        return Icons.circle;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'تحديث الحالة',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),

          // Status Buttons
          _buildStatusButton(
            status: MissionStatus.enRoute,
            icon: Icons.directions_car,
            label: 'في الطريق',
            emoji: '🚑',
          ),

          const SizedBox(height: 12),

          _buildStatusButton(
            status: MissionStatus.atScene,
            icon: Icons.location_on,
            label: 'في الموقع',
            emoji: '📍',
          ),

          const SizedBox(height: 12),

          _buildStatusButton(
            status: MissionStatus.completed,
            icon: Icons.check_circle,
            label: 'مكتمل',
            emoji: '✅',
          ),
        ],
      ),
    );
  }

  Widget _buildStatusButton({
    required MissionStatus status,
    required IconData icon,
    required String label,
    required String emoji,
  }) {
    final isEnabled = _isStatusEnabled(status);
    final isActive = currentStatus == status;

    return Opacity(
      opacity: isEnabled ? 1.0 : 0.5,
      child: IgnorePointer(
        ignoring: !isEnabled || isUpdating,
        child: Container(
          width: double.infinity,
          height: 60,
          decoration: BoxDecoration(
            color: isActive
                ? _getStatusColor(status)
                : Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isActive
                  ? _getStatusColor(status)
                  : Colors.white.withOpacity(0.2),
              width: 2,
            ),
            boxShadow: isActive
                ? [
                    BoxShadow(
                      color: _getStatusColor(status).withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: 2,
                    ),
                  ]
                : null,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: isEnabled && !isUpdating
                  ? () => onStatusChange(status)
                  : null,
              child: Center(
                child: isUpdating
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            emoji,
                            style: const TextStyle(fontSize: 20),
                          ),
                          const SizedBox(width: 12),
                          Icon(
                            icon,
                            color: Colors.white,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            label,
                            style: const TextStyle(
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
        ),
      ),
    );
  }
}
