import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  
const getStatusIcon = (status: string): null | React.ReactNode => {
    switch (status) {
        case 'success': 
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'warning': 
            return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        case 'error': 
            return <XCircle className="h-5 w-5 text-red-500" />;
        default: 
            return null;
    }
};

export { getStatusColor, getStatusIcon};