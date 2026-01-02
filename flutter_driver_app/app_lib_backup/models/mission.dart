class Mission {
  final String id;
  final String type;
  final String priority;
  final String description;
  final MissionLocation location;
  final MissionStatus status;
  final String? assignedDriverId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? reporterName;
  final String? reporterPhone;

  Mission({
    required this.id,
    required this.type,
    required this.priority,
    required this.description,
    required this.location,
    required this.status,
    this.assignedDriverId,
    required this.createdAt,
    required this.updatedAt,
    this.reporterName,
    this.reporterPhone,
  });

  factory Mission.fromJson(Map<String, dynamic> json) {
    return Mission(
      id: json['id'] ?? json['documentId'] ?? '',
      type: json['type'] ?? 'other',
      priority: json['priority'] ?? 'medium',
      description: json['description'] ?? '',
      location: MissionLocation.fromJson(json['location'] ?? {}),
      status: _parseStatus(json['status'] ?? 'pending'),
      assignedDriverId: json['assignedDriverId'],
      createdAt: json['createdAt'] is DateTime
          ? json['createdAt']
          : DateTime.now(),
      updatedAt: json['updatedAt'] is DateTime
          ? json['updatedAt']
          : DateTime.now(),
      reporterName: json['reporterName'],
      reporterPhone: json['reporterPhone'],
    );
  }

  static MissionStatus _parseStatus(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return MissionStatus.pending;
      case 'accepted':
        return MissionStatus.accepted;
      case 'en_route':
        return MissionStatus.enRoute;
      case 'at_scene':
        return MissionStatus.atScene;
      case 'completed':
        return MissionStatus.completed;
      default:
        return MissionStatus.pending;
    }
  }

  String get statusValue {
    switch (status) {
      case MissionStatus.pending:
        return 'pending';
      case MissionStatus.accepted:
        return 'accepted';
      case MissionStatus.enRoute:
        return 'en_route';
      case MissionStatus.atScene:
        return 'at_scene';
      case MissionStatus.completed:
        return 'completed';
    }
  }
}

enum MissionStatus {
  pending,
  accepted,
  enRoute,
  atScene,
  completed,
}

class MissionLocation {
  final double lat;
  final double lng;
  final String address;

  MissionLocation({
    required this.lat,
    required this.lng,
    required this.address,
  });

  factory MissionLocation.fromJson(Map<String, dynamic> json) {
    return MissionLocation(
      lat: (json['lat'] ?? 0.0).toDouble(),
      lng: (json['lng'] ?? 0.0).toDouble(),
      address: json['address'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
      'address': address,
    };
  }
}
