
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import { Transaction } from "@/types/Transaction";
import { format } from "date-fns";

const CURRENCY = "LKR";

const Transactions = () => {
  const { toast } = useToast();
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
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <TransactionForm onAddTransaction={handleAddTransaction} currency={CURRENCY} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={handleDeleteTransaction} 
              onEditTransaction={handleEditTransaction}
              currency={CURRENCY} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
