
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Index from "@/pages/u/Index";
import Dashboard from "@/pages/u/Dashboard";
import Report from "@/pages/u/Report";
import EmergencyReport from "@/pages/u/EmergencyReport";
import Auth from "@/pages/u/Auth";
import NotFound from "@/pages/u/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/emergency" element={<EmergencyReport />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
