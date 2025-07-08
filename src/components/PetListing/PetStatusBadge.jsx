import React from 'react';
import { FaCheck, FaHeart, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const PetStatusBadge = ({ status, size = 'sm', className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return {
          icon: FaHeart,
          text: 'Available',
          bgColor: 'bg-primary/80',
          textColor: 'text-primary-content',
          iconColor: 'text-primary-content'
        };
      case 'adopted':
        return {
          icon: FaCheck,
          text: 'Adopted',
          bgColor: 'bg-success/80',
          textColor: 'text-success-content',
          iconColor: 'text-success-content'
        };
      case 'pending':
        return {
          icon: FaClock,
          text: 'Pending',
          bgColor: 'bg-warning/80',
          textColor: 'text-warning-content',
          iconColor: 'text-warning-content'
        };
      case 'unavailable':
        return {
          icon: FaExclamationTriangle,
          text: 'Unavailable',
          bgColor: 'bg-error/80',
          textColor: 'text-error-content',
          iconColor: 'text-error-content'
        };
      default:
        return {
          icon: FaHeart,
          text: 'Available',
          bgColor: 'bg-primary/80',
          textColor: 'text-primary-content',
          iconColor: 'text-primary-content'
        };
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-5 py-2 text-base';
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  const getIconSize = (size) => {
    switch (size) {
      case 'xs':
        return 'w-3 h-3';
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-3 h-3';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const iconSize = getIconSize(size);
  const IconComponent = config.icon;

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium backdrop-blur-sm
      ${config.bgColor} ${config.textColor} ${sizeClasses} ${className}
    `}>
      <IconComponent className={`${iconSize} ${config.iconColor}`} />
      <span>{config.text}</span>
    </span>
  );
};

export default PetStatusBadge;
