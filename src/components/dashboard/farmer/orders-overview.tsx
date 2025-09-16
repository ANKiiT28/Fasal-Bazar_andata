
"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "Mon", received: 10, completed: 8 },
  { name: "Tue", received: 15, completed: 12 },
  { name: "Wed", received: 8, completed: 8 },
  { name: "Thu", received: 20, completed: 18 },
  { name: "Fri", received: 12, completed: 10 },
  { name: "Sat", received: 25, completed: 25 },
  { name: "Sun", received: 18, completed: 15 },
];

export function OrdersOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders: Received vs. Completed</CardTitle>
        <CardDescription>A summary of your orders over the last week.</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="received" fill="hsl(var(--chart-2))" name="Received" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="hsl(var(--chart-1))" name="Completed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
