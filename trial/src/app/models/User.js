import { Timestamp } from 'firebase/firestore';

export class User {
  constructor(
    uid,
    fullName,
    email,
    phone = null,
    role = 'user',
    createdAt = new Date(),
    updatedAt = new Date(),
    photoURL = null,
    address = null,
    emailVerified = false,
    phoneVerified = false,
    lastLogin = null,
    reportHistory = []
  ) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.photoURL = photoURL;
    this.address = address;
    this.emailVerified = emailVerified;
    this.phoneVerified = phoneVerified;
    this.lastLogin = lastLogin;
    this.reportHistory = reportHistory;
  }

  // Create a new emergency user with just phone number
  static createEmergencyUser(uid, phone) {
    const user = new User(
      uid,
      'Emergency User', // Default name
      null, // No email
      phone,
      'guest', // Emergency users have guest role
      new Date(),
      new Date(),
      null,
      null,
      false,
      true, // Phone is verified for emergency users
      new Date(),
      []
    );
    return user;
  }

  addReport(reportId) {
    this.reportHistory.push(reportId);
    this.updatedAt = new Date();
  }

  markEmailVerified() {
    this.emailVerified = true;
    this.updatedAt = new Date();
  }

  markPhoneVerified() {
    this.phoneVerified = true;
    this.updatedAt = new Date();
  }

  updateLoginTimestamp() {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }

  static converter = {
    toFirestore: (user) => {
      return {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt instanceof Date ? Timestamp.fromDate(user.createdAt) : user.createdAt,
        updatedAt: user.updatedAt instanceof Date ? Timestamp.fromDate(user.updatedAt) : user.updatedAt,
        photoURL: user.photoURL,
        address: user.address,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLogin: user.lastLogin instanceof Date ? Timestamp.fromDate(user.lastLogin) : user.lastLogin,
        reportHistory: user.reportHistory
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new User(
        data.uid,
        data.fullName,
        data.email,
        data.phone,
        data.role,
        data.createdAt?.toDate(),
        data.updatedAt?.toDate(),
        data.photoURL,
        data.address,
        data.emailVerified,
        data.phoneVerified,
        data.lastLogin?.toDate(),
        data.reportHistory || []
      );
    }
  };
}
