# Firebase + Cloudinary setup

## Cloudinary (already configured in app)

- Cloud name: `dbhuwekq7`
- Unsigned upload preset: `escapeWeddingUploads`

Ensure the preset is **unsigned** and allows `image` + `raw` (PDF) uploads in your Cloudinary console.

## Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Add a **Web app** and copy the SDK config into `.env` (copy from `.env.example`)
3. Enable **Cloud Firestore** in production or test mode
4. Restart Expo after changing env vars: `npx expo start -c`

### Suggested Firestore rules (development)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Tighten these rules before shipping to production (Firebase Auth + admin claims).

## Admin access

Set `EXPO_PUBLIC_ADMIN_PIN` in `.env`, then open the **Admin** tab and enter the PIN.

## Countdown extensions

Each **approved** application adds **14 days** to the wedding countdown target date.
