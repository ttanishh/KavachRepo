import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CrimeReport } from '@/models/CrimeReport';
import { File } from '@/models/File';
import { geoAssign } from '@/lib/utils/geoAssign';
import { dateToTimestamp, timestampToDate } from '@/lib/utils/dateToTimestamp';
import fetch from 'node-fetch';

// Collection references with converters
const reportsCollection = collection(db, 'reports').withConverter(CrimeReport.converter);

export const reportsService = {
  // Create a new report
  async createReport(reportData) {
    try {
      // Generate ID
      const reportId = uuidv4();
      const reportRef = doc(reportsCollection, reportId);
      
      // Add geohash for spatial queries if location is provided
      let geohash = null;
      if (reportData.location && reportData.location.lat && reportData.location.lng) {
        geohash = geoAssign.generateGeohash(reportData.location.lat, reportData.location.lng);
      }
      
      // Create report
      await setDoc(reportRef, new CrimeReport(
        reportId,
        reportData.title,
        reportData.description,
        reportData.crimeType,
        reportData.location,
        reportData.address,
        reportData.timestamp,
        reportData.reporterId,
        reportData.district,
        reportData.status || 'pending',
        reportData.stationId || null,
        reportData.isUrgent || false,
        reportData.isAnonymous || false,
        reportData.createdAt || new Date(),
        reportData.updatedAt || null,
        geohash,
        0 // Initial media count
      ));
      
      // Add a system update for the report creation
      await this.addSystemUpdate(reportId, 'Report submitted.');
      
      // Notify about new report if assigned to a station
      if (reportData.stationId) {
        await this.notifyStationAboutNewReport(reportData.stationId, reportId, reportData.crimeType);
      }
      
      // Get the created report
      const reportDoc = await getDoc(reportRef);
      return { ...reportDoc.data(), id: reportDoc.id };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
  
  // Get report by ID
  async getReportById(reportId) {
    try {
      const reportRef = doc(reportsCollection, reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        return { ...reportDoc.data(), id: reportDoc.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting report by ID:', error);
      throw error;
    }
  },
  
  // Get reports by user ID
  async getReportsByUserId(userId) {
    try {
      const userReportsQuery = query(
        reportsCollection,
        where('reporterId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const reportsSnapshot = await getDocs(userReportsQuery);
      
      return reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error('Error getting reports by user ID:', error);
      throw error;
    }
  },
  
  // Get reports by station ID
  async getReportsByStationId(stationId, filters = {}, maxResults = 100) {
    try {
      let reportsQuery;
      
      // Base query filtering by station ID
      if (filters && filters.status) {
        reportsQuery = query(
          reportsCollection,
          where('stationId', '==', stationId),
          where('status', '==', filters.status),
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      } else {
        reportsQuery = query(
          reportsCollection,
          where('stationId', '==', stationId),
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      }
      
      const reportsSnapshot = await getDocs(reportsQuery);
      
      // Get all reports
      let reports = reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Apply additional filters
      if (filters && filters.crimeType && filters.crimeType !== 'All Types') {
        reports = reports.filter(report => report.crimeType === filters.crimeType);
      }
      
      return reports;
    } catch (error) {
      console.error('Error getting reports by station ID:', error);
      throw error;
    }
  },
  
  // Get all reports (for superadmin)
  async getAllReports(filters = {}, maxResults = 100) {
    try {
      let baseQuery;
      
      // Build query based on filters
      if (filters.status) {
        baseQuery = query(
          reportsCollection,
          where('status', '==', filters.status),
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      } else if (filters.district) {
        baseQuery = query(
          reportsCollection,
          where('district', '==', filters.district),
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      } else if (filters.stationId) {
        baseQuery = query(
          reportsCollection,
          where('stationId', '==', filters.stationId),
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      } else {
        baseQuery = query(
          reportsCollection,
          orderBy('createdAt', 'desc'),
          limit(maxResults)
        );
      }
      
      const reportsSnapshot = await getDocs(baseQuery);
      
      // Get reports
      let reports = reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Apply additional filters
      if (filters.crimeType && filters.crimeType !== 'All Types') {
        reports = reports.filter(report => report.crimeType === filters.crimeType);
      }
      
      return reports;
    } catch (error) {
      console.error('Error getting all reports:', error);
      throw error;
    }
  },
  
  // Update report
  async updateReport(reportId, updateData) {
    try {
      const reportRef = doc(reportsCollection, reportId);
      
      // Add updated timestamp if not provided
      if (!updateData.updatedAt) {
        updateData.updatedAt = dateToTimestamp(new Date());
      }
      
      await updateDoc(reportRef, updateData);
      
      // Get the updated report
      const updatedReport = await this.getReportById(reportId);
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },
  
  // Update report status
  async updateReportStatus(reportId, status, note, updatedBy) {
    try {
      const reportRef = doc(reportsCollection, reportId);
      
      // Update status
      await updateDoc(reportRef, {
        status,
        updatedAt: dateToTimestamp(new Date()),
        updatedBy
      });
      
      // Add status update
      const statusMessages = {
        pending: 'Report marked as pending.',
        investigating: 'Investigation has started on this report.',
        resolved: 'This report has been resolved.',
        closed: 'This case has been closed.',
        rejected: 'This report has been rejected.'
      };
      
      const statusMessage = statusMessages[status] || `Status updated to ${status}.`;
      const updateMessage = note ? `${statusMessage} Note: ${note}` : statusMessage;
      
      const update = await this.addSystemUpdate(reportId, updateMessage);
      
      // Get the updated report
      const updatedReport = await this.getReportById(reportId);
      
      return {
        report: updatedReport,
        update
      };
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  },
  
  // Delete report
  async deleteReport(reportId) {
    try {
      const reportRef = doc(reportsCollection, reportId);
      
      // Delete all associated media
      await this.deleteAllReportMedia(reportId);
      
      // Delete all updates/comments
      await this.deleteAllReportUpdates(reportId);
      
      // Delete the report document
      await deleteDoc(reportRef);
      
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },
  
  // Delete all media associated with a report
  async deleteAllReportMedia(reportId) {
    try {
      const mediaCollection = collection(db, `reports/${reportId}/media`);
      const mediaSnapshot = await getDocs(mediaCollection);
      
      const deletePromises = mediaSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error('Error deleting all report media:', error);
      throw error;
    }
  },
  
  // Delete all updates/comments for a report
  async deleteAllReportUpdates(reportId) {
    try {
      const updatesCollection = collection(db, `reports/${reportId}/updates`);
      const updatesSnapshot = await getDocs(updatesCollection);
      
      const deletePromises = updatesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return true;
    } catch (error) {
      console.error('Error deleting all report updates:', error);
      throw error;
    }
  },
  
  // Add a system update to a report
  async addSystemUpdate(reportId, content) {
    try {
      const updatesCollection = collection(db, `reports/${reportId}/updates`);
      
      const systemUpdate = {
        content,
        type: 'system',
        timestamp: serverTimestamp()
      };
      
      const updateRef = await addDoc(updatesCollection, systemUpdate);
      
      return { 
        ...systemUpdate,
        id: updateRef.id,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error adding system update:', error);
      throw error;
    }
  },
  
  // Add a comment to a report
  async addComment(reportId, commentData) {
    try {
      const updatesCollection = collection(db, `reports/${reportId}/updates`);
      
      const formattedComment = {
        ...commentData,
        type: 'comment',
        timestamp: serverTimestamp()
      };
      
      const commentRef = await addDoc(updatesCollection, formattedComment);
      
      return { 
        ...formattedComment,
        id: commentRef.id,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },
  
  // Get updates and comments for a report
  async getReportUpdates(reportId) {
    try {
      const updatesCollection = collection(db, `reports/${reportId}/updates`);
      const q = query(updatesCollection, orderBy('timestamp', 'asc'));
      const updatesSnapshot = await getDocs(q);
      
      return updatesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error getting report updates:', error);
      throw error;
    }
  },
  
  // Add media to report
  async addMediaToReport(reportId, fileData) {
    try {
      const mediaCollection = collection(db, `reports/${reportId}/media`);
      
      const file = {
        id: fileData.id || uuidv4(),
        filename: fileData.filename,
        type: fileData.type,
        size: fileData.size,
        url: fileData.url,
        path: fileData.path,
        uploadedAt: dateToTimestamp(fileData.uploadedAt || new Date()),
        uploadedBy: fileData.uploadedBy
      };
      
      // Add file to media collection
      const mediaRef = doc(mediaCollection, file.id);
      await setDoc(mediaRef, file);
      
      // Update media count in the report
      const reportRef = doc(reportsCollection, reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        const report = reportDoc.data();
        await updateDoc(reportRef, {
          mediaCount: (report.mediaCount || 0) + 1
        });
      }
      
      return { ...file, id: file.id };
    } catch (error) {
      console.error('Error adding media to report:', error);
      throw error;
    }
  },
  
  // Get media files for a report
  async getReportMedia(reportId) {
    try {
      const mediaCollection = collection(db, `reports/${reportId}/media`);
      const mediaSnapshot = await getDocs(mediaCollection);
      
      return mediaSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error getting report media:', error);
      throw error;
    }
  },
  
  // Get a specific media file
  async getMediaById(reportId, mediaId) {
    try {
      const mediaRef = doc(collection(db, `reports/${reportId}/media`), mediaId);
      const mediaDoc = await getDoc(mediaRef);
      
      if (mediaDoc.exists()) {
        const data = mediaDoc.data();
        return {
          ...data,
          id: mediaDoc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting media by ID:', error);
      throw error;
    }
  },
  
  // Delete media from a report
  async deleteMedia(reportId, mediaId) {
    try {
      // Delete media document
      const mediaRef = doc(collection(db, `reports/${reportId}/media`), mediaId);
      await deleteDoc(mediaRef);
      
      // Update media count in the report
      const reportRef = doc(reportsCollection, reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        const report = reportDoc.data();
        await updateDoc(reportRef, {
          mediaCount: Math.max((report.mediaCount || 0) - 1, 0)
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  },
  
  // Get nearby reports
  async getNearbyReports({ latitude, longitude, radiusInKm, timeThreshold, crimeType, limit = 50 }) {
    try {
      // Get bounding box coordinates for the radius
      const bounds = geoAssign.getBoundingBoxCoordinates(latitude, longitude, radiusInKm);
      
      // Generate geohashes for the bounds
      const lesserGeoHash = geoAssign.generateGeohash(bounds.minLat, bounds.minLng);
      const greaterGeoHash = geoAssign.generateGeohash(bounds.maxLat, bounds.maxLng);
      
      // Query for reports within the bounding box
      let reportsQuery = query(
        reportsCollection,
        where('geohash', '>=', lesserGeoHash),
        where('geohash', '<=', greaterGeoHash),
        orderBy('geohash'),
        orderBy('createdAt', 'desc'),
        limit(100) // Initial limit to reduce processing
      );
      
      const reportsSnapshot = await getDocs(reportsQuery);
      
      // Filter results
      let reports = reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Filter by time if specified
      if (timeThreshold) {
        reports = reports.filter(report => {
          const reportDate = timestampToDate(report.createdAt);
          return reportDate >= timeThreshold;
        });
      }
      
      // Filter by crime type if specified
      if (crimeType) {
        reports = reports.filter(report => report.crimeType === crimeType);
      }
      
      // Calculate actual distance and filter by radius
      reports = reports
        .map(report => {
          const distance = geoAssign.calculateDistance(
            latitude,
            longitude,
            report.location.lat,
            report.location.lng
          );
          
          return { ...report, distance };
        })
        .filter(report => report.distance <= radiusInKm)
        .sort((a, b) => a.distance - b.distance);
      
      // Limit results
      if (limit && reports.length > limit) {
        reports = reports.slice(0, limit);
      }
      
      return reports;
    } catch (error) {
      console.error('Error getting nearby reports:', error);
      throw error;
    }
  },
  
  // Notify a police station about a new report
  async notifyStationAboutNewReport(stationId, reportId, crimeType) {
    try {
      // Send a notification to the socket endpoint
      if (process.env.SOCKET_WEBHOOK_URL) {
        await fetch(process.env.SOCKET_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SOCKET_SECRET_KEY}`
          },
          body: JSON.stringify({
            type: 'new_report',
            stationId,
            reportId,
            crimeType,
            timestamp: new Date().toISOString()
          })
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error notifying station about new report:', error);
      // Don't throw error, just log it - we don't want the report creation to fail
      return false;
    }
  },
  
  // Notify station about urgent report
  async notifyStationAboutUrgentReport(stationId, reportId, crimeType) {
    try {
      // Send a notification to the socket endpoint
      if (process.env.SOCKET_WEBHOOK_URL) {
        await fetch(process.env.SOCKET_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SOCKET_SECRET_KEY}`
          },
          body: JSON.stringify({
            type: 'urgent_report',
            stationId,
            reportId,
            crimeType,
            timestamp: new Date().toISOString()
          })
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error notifying station about urgent report:', error);
      return false;
    }
  },
  
  // Get report statistics
  async getReportStats(timeRange = 'month', district = null, stationId = null) {
    try {
      // Determine time threshold based on timeRange
      const now = new Date();
      let timeThreshold = new Date();
      
      switch (timeRange) {
        case 'week':
          timeThreshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeThreshold.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          timeThreshold.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          timeThreshold.setFullYear(now.getFullYear() - 1);
          break;
        case 'all':
          timeThreshold = new Date(0); // Beginning of time
          break;
      }
      
      // Build query based on filters
      let reportsQuery;
      
      if (stationId) {
        reportsQuery = query(
          reportsCollection,
          where('stationId', '==', stationId),
          where('createdAt', '>=', dateToTimestamp(timeThreshold))
        );
      } else if (district) {
        reportsQuery = query(
          reportsCollection,
          where('district', '==', district),
          where('createdAt', '>=', dateToTimestamp(timeThreshold))
        );
      } else {
        reportsQuery = query(
          reportsCollection,
          where('createdAt', '>=', dateToTimestamp(timeThreshold))
        );
      }
      
      const reportsSnapshot = await getDocs(reportsQuery);
      const reports = reportsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      // Calculate statistics
      const stats = {
        totalReports: reports.length,
        byStatus: {
          pending: reports.filter(r => r.status === 'pending').length,
          investigating: reports.filter(r => r.status === 'investigating').length,
          resolved: reports.filter(r => r.status === 'resolved').length,
          closed: reports.filter(r => r.status === 'closed').length,
          rejected: reports.filter(r => r.status === 'rejected').length,
        },
        byCrimeType: {},
        byDistrict: {},
        byTimeOfDay: {
          morning: 0,   // 6 AM - 12 PM
          afternoon: 0, // 12 PM - 5 PM
          evening: 0,   // 5 PM - 9 PM
          night: 0      // 9 PM - 6 AM
        }
      };
      
      // Calculate distribution by crime type
      reports.forEach(report => {
        // Crime type
        const crimeType = report.crimeType || 'Unknown';
        stats.byCrimeType[crimeType] = (stats.byCrimeType[crimeType] || 0) + 1;
        
        // District
        const district = report.district || 'Unknown';
        stats.byDistrict[district] = (stats.byDistrict[district] || 0) + 1;
        
        // Time of day
        if (report.timestamp) {
          const hour = new Date(report.timestamp).getHours();
          
          if (hour >= 6 && hour < 12) {
            stats.byTimeOfDay.morning++;
          } else if (hour >= 12 && hour < 17) {
            stats.byTimeOfDay.afternoon++;
          } else if (hour >= 17 && hour < 21) {
            stats.byTimeOfDay.evening++;
          } else {
            stats.byTimeOfDay.night++;
          }
        }
      });
      
      // Format for charts
      stats.statusDistribution = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
      stats.crimeTypeDistribution = Object.entries(stats.byCrimeType).map(([name, value]) => ({ name, value }));
      stats.districtDistribution = Object.entries(stats.byDistrict).map(([name, value]) => ({ name, value }));
      stats.timeOfDayDistribution = Object.entries(stats.byTimeOfDay).map(([name, value]) => ({ name, value }));
      
      return stats;
    } catch (error) {
      console.error('Error getting report stats:', error);
      throw error;
    }
  },
  
  // Get heatmap data for reports
  async getHeatmapData(timeRange = 'month', district = null) {
    try {
      const stats = await this.getReportStats(timeRange, district);
      
      // Format data for heatmap
      const heatmapPoints = [];
      
      // Get all reports for the time range and district
      const reports = await this.getAllReports({ 
        district, 
        timeRange 
      }, 1000);
      
      // Extract location data
      reports.forEach(report => {
        if (report.location && report.location.lat && report.location.lng) {
          heatmapPoints.push({
            lat: report.location.lat,
            lng: report.location.lng,
            weight: report.isUrgent ? 2 : 1 // Give urgent reports more weight
          });
        }
      });
      
      return {
        points: heatmapPoints,
        stats
      };
    } catch (error) {
      console.error('Error getting heatmap data:', error);
      throw error;
    }
  }
};
