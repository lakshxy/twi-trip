rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Remove or use the isValidPhone function
    // function isValidPhone(phone) {
    //   return phone.matches('^\\+[0-9]{10,}$');
    // }

    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}