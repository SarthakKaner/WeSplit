import React from 'react';

export function BarChart({ data, className = "" }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={`space-y-2 ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-16 sm:w-20 text-xs sm:text-sm text-gray-600 truncate" title={item.label}>
            {item.label}
          </div>
          <div className="flex-1 relative">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div
                className="bg-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-12 sm:w-16 text-xs sm:text-sm text-gray-900 text-right font-medium">
            ₹{item.value.toFixed(0)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ data, className = "" }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const colors = [
    'text-emerald-500',
    'text-blue-500', 
    'text-purple-500',
    'text-orange-500',
    'text-red-500',
    'text-yellow-500',
    'text-pink-500',
    'text-indigo-500'
  ];

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Simple visual representation */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0 relative bg-gray-100 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900">₹{total.toFixed(0)}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-2">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-current ${colors[index % colors.length]}`} />
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{item.label}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 font-medium">
                    ₹{item.value.toFixed(0)} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
