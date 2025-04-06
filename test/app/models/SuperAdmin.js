import { Timestamp } from 'firebase/firestore';

export class SuperAdmin {
  constructor(
    uid,
    fullName,
    email,
    phone = null,
    role = 'superadmin',
    createdAt = new Date(),
    updatedAt = new Date(),
    photoURL = null
  ) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.photoURL = photoURL;
  }

  static converter = {
    toFirestore: (superAdmin) => {
      return {
        uid: superAdmin.uid,
        fullName: superAdmin.fullName,
        email: superAdmin.email,
        phone: superAdmin.phone,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt instanceof Date ? Timestamp.fromDate(superAdmin.createdAt) : superAdmin.createdAt,
        updatedAt: superAdmin.updatedAt instanceof Date ? Timestamp.fromDate(superAdmin.updatedAt) : superAdmin.updatedAt,
        photoURL: superAdmin.photoURL
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new SuperAdmin(
        data.uid,
        data.fullName,
        data.email,
        data.phone,
        data.role,
        data.createdAt?.toDate(),
        data.updatedAt?.toDate(),
        data.photoURL
      );
    }
  };
}
