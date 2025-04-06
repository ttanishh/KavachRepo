import fetch from 'node-fetch';
import ngeohash from 'ngeohash';

export const geoAssign = {
  async getDistrictFromCoordinates(location) {
    try {
      // Use Mapbox Geocoding API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=district,locality,place`
      );
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return { 
          district: 'Unknown',
          formattedAddress: 'Unknown location'
        };
      }
      
      // Extract district/locality name
      let district = 'Unknown';
      let formattedAddress = '';
      
      // Try to find district first
      const districtFeature = data.features.find(f => 
        f.place_type.includes('district') || 
        f.place_type.includes('locality') ||
        f.place_type.includes('place')
      );
      
      if (districtFeature) {
        district = districtFeature.text;
      }
      
      // Get a readable address
      if (data.features[0]) {
        formattedAddress = data.features[0].place_name;
      }
      
      return { district, formattedAddress };
    } catch (error) {
      console.error('Error getting district from coordinates:', error);
      return { 
        district: 'Unknown', 
        formattedAddress: 'Unknown location'
      };
    }
  },
  
  generateGeohash(lat, lng, precision = 9) {
    return ngeohash.encode(lat, lng, precision);
  },
  
  calculateDistance(lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      return 0;
    }
    
    // Haversine formula to calculate distance in km
    const R = 6371; // Earth's radius in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return distance;
  },
  
  degToRad(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  getBoundingBoxCoordinates(lat, lng, radiusInKm) {
    const R = 6371; // Earth's radius in km
    
    // Convert radius from km to radians
    const radDist = radiusInKm / R;
    
    const radLat = this.degToRad(lat);
    const radLng = this.degToRad(lng);
    
    const minLat = radLat - radDist;
    const maxLat = radLat + radDist;
    
    // Longitude gets smaller as we approach the poles
    let deltaLng = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    
    let minLng = radLng - deltaLng;
    let maxLng = radLng + deltaLng;
    
    // Convert back to degrees
    return {
      minLat: this.radToDeg(minLat),
      minLng: this.radToDeg(minLng),
      maxLat: this.radToDeg(maxLat),
      maxLng: this.radToDeg(maxLng)
    };
  },
  
  radToDeg(radians) {
    return radians * (180 / Math.PI);
  }
};
