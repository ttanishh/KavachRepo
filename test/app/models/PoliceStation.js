import { Timestamp } from 'firebase/firestore';

export class PoliceStation {
  constructor(
    id,
    name,
    district,
    address,
    location,
    phone = null,
    email = null,
    isActive = true,
    createdAt = new Date(),
    createdBy = null,
    updatedAt = null,
    updatedBy = null
  ) {
    this.id = id;
    this.name = name;
    this.district = district;
    this.address = address;
    this.location = location; // { lat, lng }
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static converter = {
    toFirestore: (station) => {
      return {
        name: station.name,
        district: station.district,
        address: station.address,
        location: station.location,
        phone: station.phone,
        email: station.email,
        isActive: station.isActive,
        createdAt: station.createdAt instanceof Date ? Timestamp.fromDate(station.createdAt) : station.createdAt,
        createdBy: station.createdBy,
        updatedAt: station.updatedAt instanceof Date ? (station.updatedAt ? Timestamp.fromDate(station.updatedAt) : null) : station.updatedAt,
        updatedBy: station.updatedBy
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new PoliceStation(
        snapshot.id,
        data.name,
        data.district,
        data.address,
        data.location,
        data.phone,
        data.email,
        data.isActive,
        data.createdAt?.toDate(),
        data.createdBy,
        data.updatedAt?.toDate(),
        data.updatedBy
      );
    }
  };
}
