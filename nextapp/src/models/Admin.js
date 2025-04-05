import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} Admin
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} password
 * @property {Date} createdAt
 */

const adminConverter = {
  toFirestore: (admin) => {
    return {
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      password: admin.password, 
      createdAt: dateToTimestamp(admin.createdAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      createdAt: data.createdAt?.toDate()
    };
  }
};

// Collection and document references
const admins = (db) => collection(db, 'admins').withConverter(adminConverter);
const adminDoc = (db, id) => doc(db, 'admins', id).withConverter(adminConverter);

export { admins, adminDoc, adminConverter };