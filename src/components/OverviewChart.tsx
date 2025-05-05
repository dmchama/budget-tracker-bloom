
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface OverviewChartProps {
  data: {
    name: string;
    income: number;
    expenses: number;
  }[];
}

const OverviewChart = ({ data }: OverviewChartProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar 
              dataKey="income" 
              fill="#9b87f5" 
              radius={[4, 4, 0, 0]} 
              name="Income"
            />
            <Bar 
              dataKey="expenses" 
              fill="#f87171" 
              radius={[4, 4, 0, 0]} 
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
