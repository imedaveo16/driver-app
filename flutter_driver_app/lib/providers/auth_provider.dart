import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hive_flutter/hive_flutter.dart';

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState.initial()) {
    _loadAuthData();
  }

  Future<void> _loadAuthData() async {
    final authBox = Hive.box('auth');
    final email = authBox.get('email');
    final driverId = authBox.get('driverId');

    if (email != null && driverId != null) {
      state = AuthState.authenticated(
        email: email,
        driverId: driverId,
      );
    }
  }

  Future<bool> login(String email, String driverId) async {
    try {
      // Validate login (you can add actual authentication here)
      if (email.isEmpty || driverId.isEmpty) {
        state = AuthState.error('الرجاء إدخال جميع البيانات');
        return false;
      }

      // Save to Hive
      final authBox = Hive.box('auth');
      await authBox.put('email', email);
      await authBox.put('driverId', driverId);

      state = AuthState.authenticated(
        email: email,
        driverId: driverId,
      );
      return true;
    } catch (e) {
      state = AuthState.error('فشل تسجيل الدخول: $e');
      return false;
    }
  }

  Future<void> logout() async {
    final authBox = Hive.box('auth');
    await authBox.clear();
    state = AuthState.initial();
  }
}

class AuthState {
  final bool isAuthenticated;
  final String? email;
  final String? driverId;
  final String? error;

  AuthState({
    required this.isAuthenticated,
    this.email,
    this.driverId,
    this.error,
  });

  factory AuthState.initial() {
    return AuthState(isAuthenticated: false);
  }

  factory AuthState.authenticated({
    required String email,
    required String driverId,
  }) {
    return AuthState(
      isAuthenticated: true,
      email: email,
      driverId: driverId,
    );
  }

  factory AuthState.error(String error) {
    return AuthState(
      isAuthenticated: false,
      error: error,
    );
  }
}

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) => AuthNotifier());
