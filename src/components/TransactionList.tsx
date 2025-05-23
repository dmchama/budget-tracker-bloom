
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Calendar, Search, Edit, Trash2 } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import TransactionEditor from "./TransactionEditor";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  currency?: string;
}

const TransactionList = ({ 
  transactions, 
  onDeleteTransaction, 
  onEditTransaction,
  currency = "LKR" 
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount: number) => {
    return `${currency} ${amount.toLocaleString('si-LK')}`;
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (editedTransaction: Transaction) => {
    if (onEditTransaction) {
      onEditTransaction(editedTransaction);
    }
    setIsEditDialogOpen(false);
    setEditingTransaction(null);
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No transactions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first income or expense to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    // Mobile view - card-based layout
    return (
      <Card>
        <CardHeader className="flex flex-col space-y-2">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-card border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{transaction.description}</span>
                    <div className={`flex items-center font-medium ${transaction.type === "income" ? "text-finance-green" : "text-finance-red"}`}>
                      {transaction.type === "income" ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {formatAmount(transaction.amount)}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>
                      <span className="capitalize">{transaction.category}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(transaction)}
                        className="h-auto p-1 text-gray-500 hover:text-blue-500"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="h-auto p-1 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No matching transactions found.
            </div>
          )}
        </CardContent>
        <TransactionEditor
          transaction={editingTransaction}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEdit}
          currency={currency}
        />
      </Card>
    );
  }

  // Desktop view - table layout
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">{transaction.category}</TableCell>
                  <TableCell className="text-right font-medium flex justify-end items-center">
                    {transaction.type === "income" ? (
                      <ArrowUp className="h-4 w-4 text-finance-green mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-finance-red mr-1" />
                    )}
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No matching transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <TransactionEditor
        transaction={editingTransaction}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEdit}
        currency={currency}
      />
    </Card>
  );
};

export default TransactionList;
