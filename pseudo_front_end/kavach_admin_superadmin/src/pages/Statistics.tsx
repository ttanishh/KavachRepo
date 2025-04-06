
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { getReports } from "@/lib/reportUtils";
import { Report, ReportStatus, CrimeCategory } from "@/types/report";

export default function Statistics() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const allReports = await getReports();
        setReports(allReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Status statistics
  const statusData = [
    { name: "Pending", value: reports.filter(r => r.status === "pending").length },
    { name: "Investigating", value: reports.filter(r => r.status === "investigating").length },
    { name: "Resolved", value: reports.filter(r => r.status === "resolved").length }
  ];

  // Crime category statistics
  const categoryData = Object.values(CrimeCategory)
    .filter(value => typeof value === 'string')
    .map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: reports.filter(r => r.category === category).length || 0
    }));

  // Time-based statistics (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const timeData = Array.from({ length:
 7 }, (_, i) => {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateString = date.toLocaleDateString();
    const count = reports.filter(r => {
      const reportDate = new Date(r.timestamp);
      return reportDate.toLocaleDateString() === dateString;
    }).length;
    
    return {
      name: dateString,
      value: count
    };
  }).reverse();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-fade">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">KAVACH Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Crime reporting analytics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reports</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-civic-primary">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Investigations</CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-civic-secondary">
              {reports.filter(r => r.status === "investigating").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Resolution Rate</CardTitle>
            <CardDescription>Percentage of resolved cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-civic-success">
              {reports.length > 0 
                ? Math.round((reports.filter(r => r.status === "resolved").length / reports.length) * 100) 
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="category">Categories</TabsTrigger>
          <TabsTrigger value="time">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Reports by Status</CardTitle>
              <CardDescription>
                Distribution of reports across different statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="category" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Reports by Category</CardTitle>
              <CardDescription>
                Distribution of reports across different crime categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Reports Timeline</CardTitle>
              <CardDescription>
                Number of reports submitted over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
