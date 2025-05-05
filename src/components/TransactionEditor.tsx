
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Transaction } from "@/types/Transaction";
import { format } from "date-fns";

interface TransactionEditorProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  currency?: string;
}

const TransactionEditor = ({ 
  transaction, 
  isOpen, 
  onClose, 
  onSave, 
  currency = "LKR" 
}: TransactionEditorProps) => {
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("salary");

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategory(transaction.category);
    }
  }, [transaction]);

  const incomeCategories = [
    "salary", "freelance", "gift", "investment", "other"
  ];
  
  const expenseCategories = [
    "housing", "food", "transportation", "utilities", "entertainment", "healthcare", "education", "shopping", "other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction || !description || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      type,
      amount: parseFloat(amount),
      description,
      category,
    };

    onSave(updatedTransaction);
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => {
                setType(value as "income" | "expense");
                setCategory(value === "income" ? "salary" : "housing");
              }}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="edit-income" />
                <Label htmlFor="edit-income">Income</Label>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <RadioGroupItem value="expense" id="edit-expense" />
                <Label htmlFor="edit-expense">Expense</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input 
              id="edit-description" 
              placeholder="Enter description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount ({currency})</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-gray-500">{currency}</span>
              <Input 
                id="edit-amount" 
                className="pl-12"
                placeholder="0.00" 
                type="number"
                min="0.01" 
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              className={type === "income" ? "bg-finance-green hover:bg-finance-green/90" : "bg-finance-red hover:bg-finance-red/90"}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditor;
