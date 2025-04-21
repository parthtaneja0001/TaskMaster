import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-500 dark:text-primary-300">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          {(description || trend) && (
            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
              {trend && (
                <span
                  className={cn(
                    "mr-1 flex items-center",
                    trend.isPositive
                      ? "text-success-500 dark:text-success-400"
                      : "text-danger-500 dark:text-danger-400"
                  )}
                >
                  {trend.isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;