import { Timestamp } from 'firebase/firestore';

export class Admin {
  constructor(
    uid,
    fullName,
    email,
    phone = null,
    stationId,
    role = 'admin',
    createdAt = new Date(),
    updatedAt = new Date(),
    photoURL = null,
    isActive = true
  ) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.stationId = stationId;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.photoURL = photoURL;
    this.isActive = isActive;
  }

  static converter = {
    toFirestore: (admin) => {
      return {
        uid: admin.uid,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        stationId: admin.stationId,
        role: admin.role,
        createdAt: admin.createdAt instanceof Date ? Timestamp.fromDate(admin.createdAt) : admin.createdAt,
        updatedAt: admin.updatedAt instanceof Date ? Timestamp.fromDate(admin.updatedAt) : admin.updatedAt,
        photoURL: admin.photoURL,
        isActive: admin.isActive
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Admin(
        data.uid,
        data.fullName,
        data.email,
        data.phone,
        data.stationId,
        data.role,
        data.createdAt?.toDate(),
        data.updatedAt?.toDate(),
        data.photoURL,
        data.isActive
      );
    }
  };
}
