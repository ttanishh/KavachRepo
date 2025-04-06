
import { useState } from "react";
import NotificationsPanel from "./NotificationsPanel";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout } from "@/utils/web3Auth";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const NavbarExtras = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
  };
  
  const handleLogin = () => {
    navigate("/emergency");
  };
  
  return (
    <div className="flex items-center gap-2">
      <NotificationsPanel />
      
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost"
            size="icon"
            className="relative"
          >
            <User className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-xs flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogin}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default NavbarExtras;
