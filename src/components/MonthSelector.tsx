
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";

interface MonthSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MonthSelector = ({ currentDate, onDateChange }: MonthSelectorProps) => {
  const handlePrevMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePrevMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">
        {format(currentDate, "MMMM yyyy")}
      </h2>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
