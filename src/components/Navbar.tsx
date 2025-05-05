
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, Home, Wallet, BarChart2, Settings } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [currentDate] = useState(new Date());
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determine which tab is active based on the current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path === "/transactions") return "transactions";
    if (path === "/reports") return "reports";
    if (path === "/settings") return "settings";
    return "dashboard";
  };

  return (
    <nav className="bg-background border-b border-border px-4 py-3 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4 w-full md:w-auto justify-between">
        <h1 className="font-bold text-xl md:text-2xl text-finance-purple">Budget Bloom</h1>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {format(currentDate, "MMMM yyyy")}
        </div>
      </div>

      <div className="mt-3 md:mt-0 w-full md:w-auto overflow-x-auto">
        <Tabs defaultValue={getActiveTab()} value={getActiveTab()} className="w-full">
          <TabsList className="bg-background/30 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2" asChild>
              <Link to="/transactions">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Transactions</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2" asChild>
              <Link to="/reports">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  );
};

export default Navbar;
