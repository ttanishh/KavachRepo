import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} SuperAdmin
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {Date} createdAt
 */

const superAdminConverter = {
  toFirestore: (superAdmin) => {
    return {
      name: superAdmin.name,
      email: superAdmin.email,
      password: superAdmin.password,
      createdAt: dateToTimestamp(superAdmin.createdAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt?.toDate()
    };
  }
};

// Collection reference
const superAdminsCollection = 'superAdmins';

// Helper functions that return the actual reference
const superAdmins = (db) => collection(db, superAdminsCollection);
const superAdminDoc = (db, id) => id ? doc(db, superAdminsCollection, id) : doc(collection(db, superAdminsCollection));

export { superAdmins, superAdminDoc, superAdminConverter, superAdminsCollection };