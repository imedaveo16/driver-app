# Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugins.**  { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
