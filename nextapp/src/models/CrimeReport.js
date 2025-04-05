import { collection, doc, GeoPoint, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} CrimeReport
 * @property {string} id
 * @property {string} reporterId
 * @property {string} crimeType
 * @property {string} [description]
 * @property {Date} [occurredAt]
 * @property {Date} reportedAt
 * @property {CrimeReportStatus} status
 * @property {{lat: number, lng: number}} location
 * @property {string[]} [mediaUrls]
 * @property {Date} createdAt
 */

/**
 * @enum {string}
 */
const CrimeReportStatus = {
  NEW: 'new',
  IN_REVIEW: 'in_review',
  ASSIGNED: 'assigned',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

const crimeReportConverter = {
  toFirestore: (report) => {
    return {
      reporterId: report.reporterId,
      crimeType: report.crimeType,
      description: report.description || null,
      occurredAt: dateToTimestamp(report.occurredAt),
      reportedAt: dateToTimestamp(report.reportedAt),
      status: report.status,
      location: new GeoPoint(report.location.lat, report.location.lng),
      mediaUrls: report.mediaUrls || [],
      createdAt: dateToTimestamp(report.createdAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      reporterId: data.reporterId,
      crimeType: data.crimeType,
      description: data.description,
      occurredAt: data.occurredAt?.toDate(),
      reportedAt: data.reportedAt?.toDate(),
      status: data.status,
      location: { 
        lat: data.location.latitude, 
        lng: data.location.longitude 
      },
      mediaUrls: data.mediaUrls || [],
      createdAt: data.createdAt?.toDate()
    };
  }
};

// Collection and document references
const crimeReports = (db) => collection(db, 'crimeReports').withConverter(crimeReportConverter);
const crimeReportDoc = (db, id) => doc(db, 'crimeReports', id).withConverter(crimeReportConverter);

export { crimeReports, crimeReportDoc, crimeReportConverter };