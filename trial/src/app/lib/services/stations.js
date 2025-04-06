import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PoliceStation } from '@/models/PoliceStation';
import { geoAssign } from '@/lib/utils/geoAssign';
import { dateToTimestamp } from '@/lib/utils/dateToTimestamp';

// Collection reference with converter
const stationsCollection = collection(db, 'stations').withConverter(PoliceStation.converter);

export const stationsService = {
  // Create a new police station
  async createStation(stationData) {
    try {
      // Generate ID
      const stationId = uuidv4();
      const stationRef = doc(stationsCollection, stationId);
      
      // Create station
      await setDoc(stationRef, new PoliceStation(
        stationId,
        stationData.name,
        stationData.district,
        stationData.address,
        stationData.location,
        stationData.phone,
        stationData.email,
        stationData.isActive,
        stationData.createdAt || new Date(),
        stationData.createdBy,
        stationData.updatedAt,
        stationData.updatedBy
      ));
      
      // Get the created station
      const stationDoc = await getDoc(stationRef);
      return { ...stationDoc.data(), id: stationDoc.id };
    } catch (error) {
      console.error('Error creating police station:', error);
      throw error;
    }
  },
  
  // Get station by ID
  async getStationById(stationId) {
    try {
      const stationRef = doc(stationsCollection, stationId);
      const stationDoc = await getDoc(stationRef);
      
      if (stationDoc.exists()) {
        return { ...stationDoc.data(), id: stationDoc.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting station by ID:', error);
      throw error;
    }
  },
  
  // Get all stations
  async getAllStations(activeOnly = false, district = null) {
    try {
      let stationQuery;
      
      if (activeOnly && district) {
        stationQuery = query(
          stationsCollection,
          where('isActive', '==', true),
          where('district', '==', district),
          orderBy('name')
        );
      } else if (activeOnly) {
        stationQuery = query(
          stationsCollection,
          where('isActive', '==', true),
          orderBy('name')
        );
      } else if (district) {
        stationQuery = query(
          stationsCollection,
          where('district', '==', district),
          orderBy('name')
        );
      } else {
        stationQuery = query(
          stationsCollection,
          orderBy('name')
        );
      }
      
      const stationSnapshot = await getDocs(stationQuery);
      
      return stationSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error('Error getting all stations:', error);
      throw error;
    }
  },
  
  // Update station
  async updateStation(stationId, stationData) {
    try {
      const stationRef = doc(stationsCollection, stationId);
      
      // Add updated timestamp if not provided
      if (!stationData.updatedAt) {
        stationData.updatedAt = dateToTimestamp(new Date());
      }
      
      await updateDoc(stationRef, stationData);
      
      // Get the updated station
      const updatedStation = await this.getStationById(stationId);
      return updatedStation;
    } catch (error) {
      console.error('Error updating station:', error);
      throw error;
    }
  },
  
  // Delete station
  async deleteStation(stationId) {
    try {
      // Check if station can be deleted
      const canDelete = await this.canDeleteStation(stationId);
      
      if (!canDelete) {
        throw new Error('Cannot delete station with active reports');
      }
      
      const stationRef = doc(stationsCollection, stationId);
      await deleteDoc(stationRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting station:', error);
      throw error;
    }
  },
  
  // Check if station can be deleted (no active reports)
  async canDeleteStation(stationId) {
    try {
      // Check for active reports (reports that are not closed or rejected)
      const reportsCollection = collection(db, 'reports');
      const activeReportsQuery = query(
        reportsCollection,
        where('stationId', '==', stationId),
        where('status', 'in', ['pending', 'investigating', 'resolved'])
      );
      
      const activeReportsSnapshot = await getDocs(activeReportsQuery);
      
      return activeReportsSnapshot.empty;
    } catch (error) {
      console.error('Error checking if station can be deleted:', error);
      throw error;
    }
  },
  
  // Find nearest station to a location
  async findNearestStation(location, district) {
    try {
      // First try to find stations in the same district
      const districtStationsQuery = query(
        stationsCollection,
        where('district', '==', district),
        where('isActive', '==', true)
      );
      
      const districtStationsSnapshot = await getDocs(districtStationsQuery);
      
      if (districtStationsSnapshot.empty) {
        // If no stations in the district, get all active stations
        const allStationsQuery = query(
          stationsCollection,
          where('isActive', '==', true)
        );
        
        const allStationsSnapshot = await getDocs(allStationsQuery);
        
        if (allStationsSnapshot.empty) {
          return null;
        }
        
        // Calculate distances and find the nearest
        let nearestStation = null;
        let minDistance = Infinity;
        
        allStationsSnapshot.forEach(doc => {
          const station = { ...doc.data(), id: doc.id };
          const distance = geoAssign.calculateDistance(
            location.lat,
            location.lng,
            station.location.lat,
            station.location.lng
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
          }
        });
        
        return nearestStation;
      }
      
      // Calculate distances within the district and find the nearest
      let nearestStation = null;
      let minDistance = Infinity;
      
      districtStationsSnapshot.forEach(doc => {
        const station = { ...doc.data(), id: doc.id };
        const distance = geoAssign.calculateDistance(
          location.lat,
          location.lng,
          station.location.lat,
          station.location.lng
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestStation = station;
        }
      });
      
      return nearestStation;
    } catch (error) {
      console.error('Error finding nearest station:', error);
      throw error;
    }
  },
  
  // Get all districts
  async getAllDistricts() {
    try {
      const stationsQuery = query(stationsCollection);
      const stationsSnapshot = await getDocs(stationsQuery);
      
      // Extract unique districts
      const districts = new Set();
      
      stationsSnapshot.forEach(doc => {
        const station = doc.data();
        if (station.district) {
          districts.add(station.district);
        }
      });
      
      return Array.from(districts).sort();
    } catch (error) {
      console.error('Error getting all districts:', error);
      throw error;
    }
  }
};
