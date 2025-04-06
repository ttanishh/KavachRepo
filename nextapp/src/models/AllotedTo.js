import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} AllottedTo
 * @property {string} id
 * @property {string} reportId
 * @property {string} stationId
 * @property {Date} assignedAt
 * @property {string} assignedBy
 */

const allottedToConverter = {
  toFirestore: (allotment) => {
    return {
      reportId: allotment.reportId,
      stationId: allotment.stationId,
      assignedAt: dateToTimestamp(allotment.assignedAt),
      assignedBy: allotment.assignedBy
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      reportId: data.reportId,
      stationId: data.stationId,
      assignedAt: data.assignedAt?.toDate(),
      assignedBy: data.assignedBy
    };
  }
};

// Collection and document references
const allottedTo = (db) => collection(db, 'allottedTo').withConverter(allottedToConverter);
const allottedToDoc = (db, id) => doc(db, 'allottedTo', id).withConverter(allottedToConverter);

export { allottedTo, allottedToDoc, allottedToConverter };