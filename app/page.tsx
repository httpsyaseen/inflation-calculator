"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  TrendingUp,
  Calendar,
  DollarSign,
  Info,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Complete Argentina inflation data from CSV (2017-2025)
type InflationData = {
  [year: string]: {
    [month: string]: number;
  };
};

const inflationData: InflationData = {
  "2017": {
    "1": 1.3,
    "2": 2.5,
    "3": 2.4,
    "4": 2.6,
    "5": 1.3,
    "6": 1.2,
    "7": 1.7,
    "8": 1.4,
    "9": 1.9,
    "10": 1.5,
    "11": 1.4,
    "12": 3.1,
  },
  "2018": {
    "1": 1.8,
    "2": 2.4,
    "3": 2.3,
    "4": 2.7,
    "5": 2.1,
    "6": 3.7,
    "7": 3.1,
    "8": 3.9,
    "9": 6.5,
    "10": 5.4,
    "11": 3.2,
    "12": 3.7,
  },
  "2019": {
    "1": 2.9,
    "2": 3.8,
    "3": 4.7,
    "4": 3.4,
    "5": 3.1,
    "6": 2.7,
    "7": 2.2,
    "8": 4.0,
    "9": 5.9,
    "10": 3.3,
    "11": 4.3,
    "12": 3.7,
  },
  "2020": {
    "1": 2.3,
    "2": 2.0,
    "3": 3.3,
    "4": 1.5,
    "5": 1.5,
    "6": 2.2,
    "7": 1.9,
    "8": 2.7,
    "9": 2.8,
    "10": 3.8,
    "11": 3.2,
    "12": 4.0,
  },
  "2021": {
    "1": 4.0,
    "2": 3.6,
    "3": 4.8,
    "4": 4.1,
    "5": 3.3,
    "6": 3.2,
    "7": 3.0,
    "8": 2.5,
    "9": 3.5,
    "10": 3.5,
    "11": 2.5,
    "12": 3.8,
  },
  "2022": {
    "1": 3.9,
    "2": 4.7,
    "3": 6.7,
    "4": 5.1,
    "5": 5.1,
    "6": 5.3,
    "7": 7.4,
    "8": 7.0,
    "9": 6.2,
    "10": 6.3,
    "11": 4.9,
    "12": 5.1,
  },
  "2023": {
    "1": 6.0,
    "2": 6.6,
    "3": 7.7,
    "4": 8.4,
    "5": 7.8,
    "6": 6.0,
    "7": 6.3,
    "8": 12.4,
    "9": 12.7,
    "10": 8.3,
    "11": 12.8,
    "12": 25.5,
  },
  "2024": {
    "1": 20.6,
    "2": 13.2,
    "3": 11.0,
    "4": 8.8,
    "5": 4.2,
    "6": 4.6,
    "7": 4.0,
    "8": 4.2,
    "9": 3.5,
    "10": 2.7,
    "11": 2.4,
    "12": 2.4,
  },
  "2025": {
    "1": 2.781,
    "2": 2.5,
    "3": 2.3,
    "4": 2.718,
  },
};

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const years = Object.keys(inflationData)
  .map((year) => ({ value: Number.parseInt(year), label: year }))
  .sort((a, b) => a.value - b.value);

export default function ArgentinaInflationCalculator() {
  const [amount, setAmount] = useState<any>("");
  const [fromMonth, setFromMonth] = useState<any>("");
  const [fromYear, setFromYear] = useState<any>("");
  const [toMonth, setToMonth] = useState<any>("");
  const [toYear, setToYear] = useState<any>("");
  const [result, setResult] = useState<any>(null);
  const [totalInflation, setTotalInflation] = useState<any>(null);
  const [monthsCalculated, setMonthsCalculated] = useState<any>(0);

  const calculateInflation = () => {
    if (!amount || !fromMonth || !fromYear || !toMonth || !toYear) {
      return;
    }

    const startAmount: any = Number.parseFloat(amount);
    if (isNaN(startAmount) || startAmount <= 0) {
      return;
    }

    const currentAmount = startAmount;
    let cumulativeInflation = 1; // Start with 1 for multiplicative calculation
    let monthCount = 0;

    const startDate = new Date(
      Number.parseInt(fromYear),
      Number.parseInt(fromMonth) - 1,
      1
    );
    const endDate = new Date(
      Number.parseInt(toYear),
      Number.parseInt(toMonth) - 1,
      1
    );

    if (startDate >= endDate) {
      setResult(startAmount);
      setTotalInflation(0);
      setMonthsCalculated(0);
      return;
    }

    const currentDate = new Date(startDate);

    // Calculate cumulative inflation month by month
    while (currentDate < endDate) {
      const year = currentDate.getFullYear().toString();
      const month = currentDate.getMonth() + 1;

      if (inflationData[year] && inflationData[year][month] !== undefined) {
        const monthlyRate = inflationData[year][month] / 100;
        cumulativeInflation *= 1 + monthlyRate;
        monthCount++;
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const finalAmount: any = startAmount * cumulativeInflation;
    const totalInflationPercentage: any = (cumulativeInflation - 1) * 100;

    setResult(finalAmount);
    setTotalInflation(totalInflationPercentage);
    setMonthsCalculated(monthCount);
  };

  useEffect(() => {
    if (amount && fromMonth && fromYear && toMonth && toYear) {
      calculateInflation();
    }
  }, [amount, fromMonth, fromYear, toMonth, toYear]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: any) => {
    return `${value?.toFixed(2)}%`;
  };

  const getAvailableMonths = (selectedYear: any) => {
    if (!selectedYear || !inflationData[selectedYear]) {
      return months;
    }

    return months.filter(
      (month) => inflationData[selectedYear][month.value] !== undefined
    );
  };

  const generateChartData = () => {
    if (!amount || !fromMonth || !fromYear || !toMonth || !toYear) {
      return [];
    }

    const startAmount: any = Number.parseFloat(amount);
    if (isNaN(startAmount) || startAmount <= 0) {
      return [];
    }

    const chartData = [];
    let currentAmount = startAmount;
    let cumulativeInflation = 0;

    const startDate = new Date(
      Number.parseInt(fromYear),
      Number.parseInt(fromMonth) - 1,
      1
    );
    const endDate = new Date(
      Number.parseInt(toYear),
      Number.parseInt(toMonth) - 1,
      1
    );

    if (startDate >= endDate) {
      return [];
    }

    const currentDate = new Date(startDate);

    // Add starting point
    chartData.push({
      date: `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`,
      monthYear: `${
        months[currentDate.getMonth()].label
      } ${currentDate.getFullYear()}`,
      amount: currentAmount,
      monthlyInflation: 0,
      cumulativeInflation: 0,
    });

    // Calculate month by month
    while (currentDate < endDate) {
      const year = currentDate.getFullYear().toString();
      const month = currentDate.getMonth() + 1;

      if (inflationData[year] && inflationData[year][month] !== undefined) {
        const monthlyRate = inflationData[year][month];
        currentAmount = currentAmount * (1 + monthlyRate / 100);
        cumulativeInflation += monthlyRate;

        currentDate.setMonth(currentDate.getMonth() + 1);

        chartData.push({
          date: `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
          ).padStart(2, "0")}`,
          monthYear: `${
            months[currentDate.getMonth()].label
          } ${currentDate.getFullYear()}`,
          amount: currentAmount,
          monthlyInflation: monthlyRate,
          cumulativeInflation: (currentAmount / startAmount - 1) * 100,
        });
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return chartData;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Argentina Inflation Calculator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate how inflation has affected the purchasing power of your
            money in Argentina from 2017 to present. Enter an amount and select
            time periods to see the equivalent value.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Initial Amount
              </CardTitle>
              <CardDescription>
                Enter the amount and select the starting month/year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ARS)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in Argentine Pesos"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Month</Label>
                  <Select value={fromMonth} onValueChange={setFromMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableMonths(fromYear).map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>From Year</Label>
                  <Select value={fromYear} onValueChange={setFromYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem
                          key={year.value}
                          value={year.value.toString()}
                        >
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Equivalent Value
              </CardTitle>
              <CardDescription>
                Select the target month/year to see the equivalent value
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>To Month</Label>
                  <Select value={toMonth} onValueChange={setToMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableMonths(toYear).map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To Year</Label>
                  <Select value={toYear} onValueChange={setToYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem
                          key={year.value}
                          value={year.value.toString()}
                        >
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {result !== null && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Equivalent value:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(result)}
                    </p>
                  </div>

                  {totalInflation !== null && (
                    <div className="bg-green-50 p-3 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">
                          Total Inflation: {formatPercentage(totalInflation)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 text-sm">
                        <Info className="h-3 w-3" />
                        <span>Calculated over {monthsCalculated} months</span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        Your {formatCurrency(Number.parseFloat(amount || 0))}{" "}
                        from{" "}
                        {
                          months.find((m) => m.value.toString() === fromMonth)
                            ?.label
                        }{" "}
                        {fromYear} would need to be {formatCurrency(result)} in{" "}
                        {
                          months.find((m) => m.value.toString() === toMonth)
                            ?.label
                        }{" "}
                        {toYear} to maintain the same purchasing power.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        {result !== null && generateChartData().length > 1 && (
          <div className="space-y-6">
            {/* Amount Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Amount Growth Over Time
                </CardTitle>
                <CardDescription>
                  Shows how your{" "}
                  {formatCurrency(Number.parseFloat(amount || 0))} grows due to
                  inflation from{" "}
                  {months.find((m) => m.value.toString() === fromMonth)?.label}{" "}
                  {fromYear} to{" "}
                  {months.find((m) => m.value.toString() === toMonth)?.label}{" "}
                  {toYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-emerald-100 rounded-lg shadow-lg">
                                <p className="font-medium">{data.monthYear}</p>
                                <p className="text-emerald-600">
                                  Amount: {formatCurrency(data.amount)}
                                </p>
                                <p className="text-emerald-700">
                                  Monthly Inflation:{" "}
                                  {data.monthlyInflation.toFixed(2)}%
                                </p>
                                <p className="text-emerald-800">
                                  Cumulative:{" "}
                                  {data.cumulativeInflation.toFixed(2)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Inflation Rates Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Inflation Rates
                </CardTitle>
                <CardDescription>
                  Monthly inflation rates during the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateChartData().slice(1)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border rounded-lg shadow-lg">
                                <p className="font-medium">{data.monthYear}</p>
                                <p className="text-emerald-600">
                                  Monthly Inflation:{" "}
                                  {data.monthlyInflation.toFixed(2)}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="monthlyInflation"
                        fill="#047857"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>About This Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold mb-2">How it works</h4>
                <p className="text-sm text-gray-600">
                  This calculator uses official monthly inflation rates from
                  Argentina to compute the cumulative effect of inflation on
                  purchasing power. It compounds each monthly rate from the
                  start date to the end date.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Coverage</h4>
                <p className="text-sm text-gray-600">
                  The calculator includes complete monthly inflation data from
                  January 2017 to March 2025, covering Argentina's significant
                  inflationary periods including the hyperinflation of
                  2023-2024.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Calculation Method</h4>
                <p className="text-sm text-gray-600">
                  The calculation uses compound monthly inflation: Final Amount
                  = Initial Amount × ∏(1 + monthly_rate). This accurately
                  reflects how prices compound over time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
