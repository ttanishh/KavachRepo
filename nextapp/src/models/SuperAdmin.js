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
      password: superAdmin.password, // Note: In production, never store passwords in Firestore
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

// Collection and document references
const superAdmins = (db) => collection(db, 'superAdmins').withConverter(superAdminConverter);
const superAdminDoc = (db, id) => doc(db, 'superAdmins', id).withConverter(superAdminConverter);

export { superAdmins, superAdminDoc, superAdminConverter };