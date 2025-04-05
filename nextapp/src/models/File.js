import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} File
 * @property {string} id
 * @property {string} userId
 * @property {string} reportId
 * @property {string} roleInCase - 'reporter' | 'victim' | 'witness' | 'other'
 * @property {Date} notedAt
 */

const fileConverter = {
  toFirestore: (file) => {
    return {
      userId: file.userId,
      reportId: file.reportId,
      roleInCase: file.roleInCase,
      notedAt: dateToTimestamp(file.notedAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      reportId: data.reportId,
      roleInCase: data.roleInCase,
      notedAt: data.notedAt?.toDate()
    };
  }
};

// Collection and document references
const files = (db) => collection(db, 'files').withConverter(fileConverter);
const fileDoc = (db, id) => doc(db, 'files', id).withConverter(fileConverter);

export { files, fileDoc, fileConverter };