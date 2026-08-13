# Deprecated Express Server Backend

The Node/Express/MongoDB backend server has been removed and replaced by Firebase Cloud Firestore.
All backend logic, task persistence, statistics, and CRUD operations are now handled directly via Firebase SDK in `client/src/firebase/config.js` and `client/src/services/todoService.js`.
