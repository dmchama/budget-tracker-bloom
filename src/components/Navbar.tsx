
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const Navbar = () => {
  const [currentDate] = useState(new Date());

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="font-bold text-2xl text-finance-purple">Budget Bloom</h1>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          {format(currentDate, "MMMM yyyy")}
        </div>
      </div>
      <div>
        <Button variant="outline" size="sm">Settings</Button>
      </div>
    </nav>
  );
};

export default Navbar;
