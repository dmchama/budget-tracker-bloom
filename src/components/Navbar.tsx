
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Menu } from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [currentDate] = useState(new Date());
  const isMobile = useIsMobile();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h1 className="font-bold text-xl md:text-2xl text-finance-purple">Budget Bloom</h1>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {format(currentDate, "MMMM yyyy")}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size={isMobile ? "sm" : "default"}>Settings</Button>
      </div>
    </nav>
  );
};

export default Navbar;
