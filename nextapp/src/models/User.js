import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} User
 * @property {string} id 
 * @property {string} username
 * @property {string} email
 * @property {string} [fullName]
 * @property {string} [phone]
 * @property {boolean} isActive
 * @property {boolean} isEmergencyUser
 * @property {Date} createdAt
 * @property {Date} [lastLogin]
 */

const userConverter = {
  toFirestore: (user) => {
    return {
      username: user.username,
      email: user.email,
      fullName: user.fullName || null,
      phone: user.phone || null,
      isActive: user.isActive,
      isEmergencyUser: user.isEmergencyUser || false,
      createdAt: dateToTimestamp(user.createdAt),
      lastLogin: dateToTimestamp(user.lastLogin)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      isActive: data.isActive,
      isEmergencyUser: data.isEmergencyUser || false,
      createdAt: data.createdAt?.toDate(),
      lastLogin: data.lastLogin?.toDate()
    };
  }
};

// Collection and document references
const users = (db) => collection(db, 'users').withConverter(userConverter);
const userDoc = (db, id) => doc(db, 'users', id).withConverter(userConverter);

export { users, userDoc, userConverter };