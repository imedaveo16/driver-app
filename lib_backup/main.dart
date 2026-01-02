import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'providers/auth_provider.dart';
import 'providers/mission_provider.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp();

  // Initialize Hive for local storage
  await Hive.initFlutter();
  await Hive.openBox('auth');

  runApp(
    const ProviderScope(
      child: CivilProtectionApp(),
    ),
  );
}

class CivilProtectionApp extends ConsumerWidget {
  const CivilProtectionApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Civil Protection Driver',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.orange,
        fontFamily: 'Roboto',
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      home: const SplashScreen(),
    );
  }
}
