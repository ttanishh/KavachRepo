import { collection, doc, GeoPoint, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} PoliceStation
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {{lat: number, lng: number}} location
 * @property {string} [adminId]
 * @property {string} [contactNumber]
 * @property {string} [email]
 * @property {Date} createdAt
 */

const policeStationConverter = {
  toFirestore: (station) => {
    return {
      name: station.name,
      address: station.address,
      location: new GeoPoint(station.location.lat, station.location.lng),
      adminId: station.adminId || null,
      contactNumber: station.contactNumber || null,
      email: station.email || null,
      createdAt: dateToTimestamp(station.createdAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      address: data.address,
      location: { 
        lat: data.location.latitude, 
        lng: data.location.longitude 
      },
      adminId: data.adminId,
      contactNumber: data.contactNumber,
      email: data.email,
      createdAt: data.createdAt?.toDate()
    };
  }
};

// Collection and document references
const policeStations = (db) => collection(db, 'policeStations').withConverter(policeStationConverter);
const policeStationDoc = (db, id) => doc(db, 'policeStations', id).withConverter(policeStationConverter);

export { policeStations, policeStationDoc, policeStationConverter };