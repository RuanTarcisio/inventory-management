import { SalesSummary } from "@/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CardSalesSummaryProps {
  salesSummary: SalesSummary[];
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
}

const CardSalesSummary = ({ 
  salesSummary = [], 
  isLoading = false,
  isError = false,
  error 
}: CardSalesSummaryProps) => {
  const [timeframe, setTimeframe] = useState("weekly");

  // Cálculos derivados dos dados
  const totalValueSum = salesSummary.reduce((acc, curr) => acc + curr.totalValue, 0);
  const averageChangePercentage = salesSummary.length > 0 
    ? salesSummary.reduce((acc, curr) => acc + (curr.changePercentage || 0), 0) / salesSummary.length
    : 0;

  const highestValueData = salesSummary.reduce((acc, curr) => 
    (acc?.totalValue || 0) > curr.totalValue ? acc : curr, 
    {} as SalesSummary
  );

  const highestValueDate = highestValueData?.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return (
      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl p-5">
        <div className="text-red-500">
          Failed to load sales data: {error?.toString()}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl p-5 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="h-px bg-gray-200 mb-6"></div>
        
        <div className="flex justify-between mb-6">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
        
        <div className="h-64 w-full bg-gray-200 rounded"></div>
        
        <div className="h-px bg-gray-200 mt-6"></div>
        <div className="flex justify-between mt-4">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">Sales Summary</h2>
        <hr />
      </div>

      {/* BODY */}
      <div>
        {/* BODY HEADER */}
        <div className="flex justify-between items-center mb-6 px-7 mt-5">
          <div className="text-lg font-medium">
            <p className="text-xs text-gray-400">Value</p>
            <span className="text-2xl font-extrabold">
              ${(totalValueSum / 1000000).toLocaleString("en", {
                maximumFractionDigits: 2,
              })}m
            </span>
            <span className="text-green-500 text-sm ml-2">
              <TrendingUp className="inline w-4 h-4 mr-1" />
              {averageChangePercentage.toFixed(2)}%
            </span>
          </div>
          <select
            className="shadow-sm border border-gray-300 bg-white p-2 rounded"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        {/* CHART */}
        <ResponsiveContainer width="100%" height={350} className="px-7">
          <BarChart
            data={salesSummary}
            margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}m`}
              tick={{ fontSize: 12, dx: -1 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString("en")}`]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
            />
            <Bar
              dataKey="totalValue"
              fill="#3182ce"
              barSize={10}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div>
        <hr />
        <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
          <p>{salesSummary.length} days</p>
          <p className="text-sm">
            Highest Sales Date:{" "}
            <span className="font-bold">{highestValueDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardSalesSummary;