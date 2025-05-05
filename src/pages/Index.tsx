
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import MonthSelector from "@/components/MonthSelector";
import StatCard from "@/components/StatCard";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import OverviewChart from "@/components/OverviewChart";
import { Transaction } from "@/types/Transaction";
import { format, isSameMonth } from "date-fns";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

const CURRENCY = "LKR";

const Index = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem("transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Add currency field to existing transactions if it doesn't exist
      return parsed.map((t: any) => ({
        ...t,
        currency: t.currency || CURRENCY
      }));
    }
    return [];
  });

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Filter transactions for the current month
  const currentMonthTransactions = transactions.filter(transaction => 
    isSameMonth(new Date(transaction.date), currentDate)
  );
  
  // Calculate totals
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = monthlyIncome - monthlyExpenses;

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

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleEditTransaction = (editedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === editedTransaction.id ? editedTransaction : t)
    );
    toast({
      title: "Transaction updated",
      description: "The transaction has been modified successfully."
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed."
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${CURRENCY} ${amount.toLocaleString('si-LK')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-6">
        <MonthSelector currentDate={currentDate} onDateChange={setCurrentDate} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatCard 
            title="Monthly Income" 
            value={formatCurrency(monthlyIncome)}
            icon={<ArrowUp className="h-4 w-4 text-finance-green" />}
            className="border-l-4 border-l-finance-green"
          />
          <StatCard 
            title="Monthly Expenses" 
            value={formatCurrency(monthlyExpenses)}
            icon={<ArrowDown className="h-4 w-4 text-finance-red" />}
            className="border-l-4 border-l-finance-red"
          />
          <StatCard 
            title="Balance" 
            value={formatCurrency(balance)}
            icon={<DollarSign className="h-4 w-4" />}
            className={`border-l-4 ${balance >= 0 ? "border-l-finance-green" : "border-l-finance-red"}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <OverviewChart data={chartData} />
          </div>
          <div>
            <TransactionForm onAddTransaction={handleAddTransaction} currency={CURRENCY} />
          </div>
        </div>
        
        <TransactionList 
          transactions={currentMonthTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
          currency={CURRENCY}
        />
      </main>
    </div>
  );
};

export default Index;
