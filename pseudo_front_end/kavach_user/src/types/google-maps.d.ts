
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      getBounds(): LatLngBounds;
      getZoom(): number;
      controls: any[][];
      fitBounds(bounds: LatLngBounds): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setVisible(visible: boolean): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      getTitle(): string | undefined;
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(options: { map?: Map; anchor?: Marker }): void;
      close(): void;
      setContent(content: string | Node): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      contains(latLng: LatLng | LatLngLiteral): boolean;
    }

    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeId?: MapTypeId;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      mapTypeControl?: boolean;
      zoomControl?: boolean;
      styles?: any[];
      mapId?: string;  // Added mapId property
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      visible?: boolean;
      draggable?: boolean;
      animation?: Animation;
      zIndex?: number; // Added zIndex property
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      placeId?: string;
      bounds?: LatLngBounds;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country: string | string[];
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: LatLng;
        location_type: GeocoderLocationType;
        viewport: LatLngBounds;
      };
      address_components: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      place_id: string;
      types: string[];
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
      equals(other: Size): boolean;
    }

    interface Point {
      x: number;
      y: number;
      equals(other: Point): boolean;
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    enum MapTypeId {
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      HYBRID = 'hybrid',
      TERRAIN = 'terrain'
    }

    enum GeocoderStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    enum GeocoderLocationType {
      ROOFTOP = 'ROOFTOP',
      RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
      GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
      APPROXIMATE = 'APPROXIMATE'
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4
    }

    const event: {
      addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      removeListener(listener: MapsEventListener): void;
    };

    namespace places {
      class SearchBox {
        constructor(input: HTMLInputElement, options?: SearchBoxOptions);
        setBounds(bounds: LatLngBounds): void;
        getPlaces(): PlaceResult[];
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      class Autocomplete {
        constructor(input: HTMLInputElement, options?: AutocompleteOptions);
        setComponentRestrictions(restrictions: AutocompleteComponentRestrictions): void;
        setTypes(types: string[]): void;
        setBounds(bounds: LatLngBounds): void;
        setOptions(options: AutocompleteOptions): void;
        getPlace(): PlaceResult;
        bindTo(bindKey: string, target: any): void;
        addListener(eventName: string, handler: Function): MapsEventListener;
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds;
        componentRestrictions?: AutocompleteComponentRestrictions;
        placeIdOnly?: boolean;
        strictBounds?: boolean;
        types?: string[];
      }

      interface AutocompleteComponentRestrictions {
        country: string | string[];
      }

      interface SearchBoxOptions {
        bounds?: LatLngBounds;
      }

      interface PlaceResult {
        geometry: {
          location: LatLng;
          viewport?: LatLngBounds;
        };
        name: string;
        formatted_address: string;
        place_id: string;
      }
    }

    const ControlPosition: {
      TOP_CENTER: number;
      TOP_LEFT: number;
      TOP_RIGHT: number;
      BOTTOM_CENTER: number;
      BOTTOM_LEFT: number;
      BOTTOM_RIGHT: number;
      LEFT_CENTER: number;
      RIGHT_CENTER: number;
    };

    interface MapMouseEvent {
      latLng: LatLng;
    }
  }
}
