interface CustomMarkerOptions {
  lng: number;
  lat: number;
  title: string;
  color: "red" | "green" | "blue" | "yellow";
}

declare global {
  class CustomMarker {
    constructor(options: CustomMarkerOptions);
  }
  class CustomMap {
    constructor(container: string, options: CustomMarkerOptions);
  }
}

interface Window {
  nmsl(a: number, b: number): number;
}


declare namespac