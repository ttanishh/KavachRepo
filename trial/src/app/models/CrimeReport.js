import { Timestamp } from 'firebase/firestore';

export class CrimeReport {
  constructor(
    id,
    title,
    description,
    crimeType,
    location,
    address,
    timestamp,
    reporterId,
    district,
    status = 'pending',
    stationId = null,
    isUrgent = false,
    isAnonymous = false,
    createdAt = new Date(),
    updatedAt = null,
    geohash = null,
    mediaCount = 0
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.crimeType = crimeType;
    this.location = location; // { lat, lng }
    this.address = address;
    this.timestamp = timestamp; // when the crime occurred
    this.reporterId = reporterId;
    this.district = district;
    this.status = status;
    this.stationId = stationId;
    this.isUrgent = isUrgent;
    this.isAnonymous = isAnonymous;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.geohash = geohash;
    this.mediaCount = mediaCount;
  }

  static converter = {
    toFirestore: (report) => {
      return {
        title: report.title,
        description: report.description,
        crimeType: report.crimeType,
        location: report.location,
        address: report.address,
        timestamp: report.timestamp instanceof Date ? Timestamp.fromDate(report.timestamp) : report.timestamp,
        reporterId: report.reporterId,
        district: report.district,
        status: report.status,
        stationId: report.stationId,
        isUrgent: report.isUrgent,
        isAnonymous: report.isAnonymous,
        createdAt: report.createdAt instanceof Date ? Timestamp.fromDate(report.createdAt) : report.createdAt,
        updatedAt: report.updatedAt instanceof Date ? (report.updatedAt ? Timestamp.fromDate(report.updatedAt) : null) : report.updatedAt,
        geohash: report.geohash,
        mediaCount: report.mediaCount
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new CrimeReport(
        snapshot.id,
        data.title,
        data.description,
        data.crimeType,
        data.location,
        data.address,
        data.timestamp?.toDate(),
        data.reporterId,
        data.district,
        data.status,
        data.stationId,
        data.isUrgent,
        data.isAnonymous,
        data.createdAt?.toDate(),
        data.updatedAt?.toDate(),
        data.geohash,
        data.mediaCount
      );
    }
  };
}
