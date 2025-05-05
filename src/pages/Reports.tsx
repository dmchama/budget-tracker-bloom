
import { useState } from "react";
import Navbar from "@/components/Navbar";
import OverviewChart from "@/components/OverviewChart";
import { Transaction } from "@/types/Transaction";
import { format, isSameMonth } from "date-fns";

const Reports = () => {
  const [transactions] = useState<Transaction[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentDate] = useState(new Date());
  
  // Generate chart data for the last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - (5 - i));
    
    const monthTransactions = transactions.filter(transaction => 
      isSameMonth(new Date(transaction.date), date)
    );
    
    const income = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: format(date, "MMM"),
      income,
      expenses,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-6">
        <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
        <div className="grid gap-6">
          <OverviewChart data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default Reports;
