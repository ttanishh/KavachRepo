
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { fetchCrimes } from "@/utils/api";
import { Crime, CrimeType } from "@/types";
import { AlertTriangle, Loader2, MapPin } from "lucide-react";

interface HeatmapPoint {
  x: number;
  y: number;
  z: number;
  type: CrimeType;
  id: string;
  description: string;
}

const typeColors = {
  [CrimeType.THEFT]: "#ef4444",
  [CrimeType.ASSAULT]: "#b91c1c",
  [CrimeType.VANDALISM]: "#0ea5e9",
  [CrimeType.ROBBERY]: "#9f1239",
  [CrimeType.BURGLARY]: "#7c2d12",
  [CrimeType.HARASSMENT]: "#d97706",
  [CrimeType.FRAUD]: "#4338ca",
  [CrimeType.EMERGENCY]: "#dc2626",
  [CrimeType.OTHER]: "#525252",
};

const CrimeHeatmap = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("week");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [centerLat, setCenterLat] = useState(21.165);
  const [centerLng, setCenterLng] = useState(72.831);

  useEffect(() => {
    const loadCrimes = async () => {
      try {
        setLoading(true);
        const crimeData = await fetchCrimes();
        setCrimes(crimeData);
        
        // Get current center point from crimes average
        if (crimeData.length > 0) {
          const avgLat = crimeData.reduce((sum, crime) => sum + crime.location.lat, 0) / crimeData.length;
          const avgLng = crimeData.reduce((sum, crime) => sum + crime.location.lng, 0) / crimeData.length;
          
          setCenterLat(avgLat);
          setCenterLng(avgLng);
        }
        
        processHeatmapData(crimeData, timeRange, selectedType);
      } catch (err) {
        console.error("Failed to load crime data:", err);
        setError("Failed to load crime data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCrimes();
  }, []);

  useEffect(() => {
    processHeatmapData(crimes, timeRange, selectedType);
  }, [timeRange, selectedType, crimes]);

  const processHeatmapData = (crimes: Crime[], timeRange: string, crimeType: string) => {
    // Filter by time range
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // All time
    }
    
    // Filter crimes by date and type
    const filteredCrimes = crimes.filter(crime => {
      const crimeDate = new Date(crime.date);
      const typeMatch = crimeType === "all" || crime.type === crimeType;
      return crimeDate >= startDate && typeMatch;
    });
    
    // Convert to heatmap points
    // Normalize coordinates to be centered around the average point
    const points: HeatmapPoint[] = filteredCrimes.map(crime => ({
      x: (crime.location.lng - centerLng) * 1000, // Scale up for better visualization
      y: (crime.location.lat - centerLat) * 1000,
      z: 1, // Size value
      type: crime.type,
      id: crime.id,
      description: crime.description
    }));
    
    setHeatmapData(points);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    return (
      <Card className="p-2 border shadow-sm">
        <CardContent className="p-2">
          <div className="font-medium">{data.type}</div>
          <div className="text-xs text-muted-foreground">{data.description}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Crime Heatmap
            </CardTitle>
            <CardDescription>
              Visualization of crime distribution in the area
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Crime Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(CrimeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : heatmapData.length === 0 ? (
          <div className="flex justify-center items-center h-80 border border-dashed rounded-lg">
            <div className="text-center p-6">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No crime data available for the selected filters</p>
            </div>
          </div>
        ) : (
          <div className="h-80 w-full border rounded-lg overflow-hidden">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis type="number" dataKey="x" name="longitude" hide />
                  <YAxis type="number" dataKey="y" name="latitude" hide />
                  <ZAxis type="number" dataKey="z" range={[40, 80]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    name="Crimes"
                    data={heatmapData}
                    fill="#8884d8"
                  >
                    {heatmapData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={typeColors[entry.type] || "#525252"} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 p-4 border-t">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrimeHeatmap;
