
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  FileBarChart2, 
  HelpCircle, 
  Info, 
  LogOut, 
  Menu, 
  Shield, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { removeAuthInfo } from "@/lib/authUtils";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthInfo();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of KAVACH.",
    });
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/statistics", label: "Statistics", icon: FileBarChart2 },
    { path: "/about", label: "About KAVACH", icon: Info },
    { path: "/help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 md:hidden"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="mb-8 flex items-center justify-center py-4">
            <Shield className="h-8 w-8 text-sidebar-accent mr-2" />
            <h1 className="text-2xl font-bold text-sidebar-foreground">KAVACH</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent/10 rounded-md transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent/20 font-medium"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
