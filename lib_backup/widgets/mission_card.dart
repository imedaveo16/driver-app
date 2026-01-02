import 'package:flutter/material.dart';
import 'package:intl/intl.dart' show DateFormat;
import '../models/mission.dart';

class MissionCard extends StatelessWidget {
  final Mission mission;

  const MissionCard({super.key, required this.mission});

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return const Color(0xFFD62828);
      case 'medium':
        return const Color(0xFFFF6B35);
      default:
        return const Color(0xFF4CAF50);
    }
  }

  String _getPriorityLabel(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'حرج';
      case 'medium':
        return 'متوسط';
      default:
        return 'منخفض';
    }
  }

  String _getTypeLabel(String type) {
    switch (type.toLowerCase()) {
      case 'emergency':
        return 'طوارئ';
      case 'medical':
        return 'طبي';
      case 'fire':
        return 'حريق';
      case 'rescue':
        return 'إنقاذ';
      default:
        return 'آخر';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Priority & Type
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: _getPriorityColor(mission.priority),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _getPriorityLabel(mission.priority),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.2),
                  ),
                ),
                child: Text(
                  _getTypeLabel(mission.type),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Description
          const Text(
            'الوصف',
            style: TextStyle(
              color: Color(0xFFE0E0E0),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            mission.description,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 16),

          // Location
          const Text(
            'الموقع',
            style: TextStyle(
              color: Color(0xFFE0E0E0),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(
                Icons.location_on,
                color: Color(0xFFFF6B35),
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  mission.location.address,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Reporter Info
          if (mission.reporterPhone != null) ...[
            const Text(
              'جهة الإبلاغ',
              style: TextStyle(
                color: Color(0xFFE0E0E0),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(
                  Icons.phone,
                  color: Color(0xFFFF6B35),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    mission.reporterName != null
                        ? '${mission.reporterName} - ${mission.reporterPhone}'
                        : mission.reporterPhone!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],

          // Timestamp
          Row(
            children: [
              const Icon(
                Icons.access_time,
                color: Color(0xFFE0E0E0),
                size: 16,
              ),
              const SizedBox(width: 8),
              Text(
                DateFormat('dd/MM/yyyy HH:mm').format(mission.createdAt),
                style: TextStyle(
                  color: Colors.white.withOpacity(0.7),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
