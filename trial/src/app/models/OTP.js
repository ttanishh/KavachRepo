import { Timestamp } from 'firebase/firestore';

export class OTP {
  constructor(
    id,
    userId = null,
    email = null,
    phone = null,
    code,
    type = 'email', // 'email' or 'phone'
    createdAt = new Date(),
    expiresAt = new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    used = false
  ) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.phone = phone;
    this.code = code;
    this.type = type;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.used = used;
  }

  isValid() {
    return !this.used && this.expiresAt > new Date();
  }

  markAsUsed() {
    this.used = true;
  }

  // Generate a random 6-digit OTP
  static generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static converter = {
    toFirestore: (otp) => {
      return {
        id: otp.id,
        userId: otp.userId,
        email: otp.email,
        phone: otp.phone,
        code: otp.code,
        type: otp.type,
        createdAt: otp.createdAt instanceof Date ? Timestamp.fromDate(otp.createdAt) : otp.createdAt,
        expiresAt: otp.expiresAt instanceof Date ? Timestamp.fromDate(otp.expiresAt) : otp.expiresAt,
        used: otp.used
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new OTP(
        data.id,
        data.userId,
        data.email,
        data.phone,
        data.code,
        data.type,
        data.createdAt?.toDate(),
        data.expiresAt?.toDate(),
        data.used
      );
    }
  };
}
