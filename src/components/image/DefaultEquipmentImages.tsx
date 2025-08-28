import React from 'react';
import engineImage from '@/assets/equipment/engine.jpg';
import hydraulicImage from '@/assets/equipment/hydraulic.jpg';
import brakeImage from '@/assets/equipment/brake.jpg';
import lightImage from '@/assets/equipment/light.jpg';
import tireImage from '@/assets/equipment/tire.jpg';
import seatImage from '@/assets/equipment/seat.jpg';
import fireExtinguisherImage from '@/assets/equipment/fire-extinguisher.jpg';
import hornImage from '@/assets/equipment/horn.jpg';
import mirrorImage from '@/assets/equipment/mirror.jpg';
import fuelImage from '@/assets/equipment/fuel.jpg';
import batteryImage from '@/assets/equipment/battery.jpg';
import winchImage from '@/assets/equipment/winch.jpg';
import craneImage from '@/assets/equipment/crane.jpg';
import trackImage from '@/assets/equipment/track.jpg';
import safetyImage from '@/assets/equipment/safety.jpg';
import defaultImage from '@/assets/equipment/default.jpg';

interface DefaultEquipmentImageProps {
  category: string;
  itemText: string;
  className?: string;
}

// Map of equipment categories to default images
const getDefaultImage = (category: string, itemText: string): string => {
  const categoryLower = category.toLowerCase();
  const itemLower = itemText.toLowerCase();
  
  // Equipment-specific images
  if (itemLower.includes('engine') || itemLower.includes('motor')) return engineImage;
  if (itemLower.includes('hydraulic') || itemLower.includes('fluid')) return hydraulicImage;
  if (itemLower.includes('brake') || itemLower.includes('stop')) return brakeImage;
  if (itemLower.includes('light') || itemLower.includes('beam')) return lightImage;
  if (itemLower.includes('tire') || itemLower.includes('wheel')) return tireImage;
  if (itemLower.includes('seat') || itemLower.includes('belt')) return seatImage;
  if (itemLower.includes('fire') || itemLower.includes('extinguisher')) return fireExtinguisherImage;
  if (itemLower.includes('horn') || itemLower.includes('alarm')) return hornImage;
  if (itemLower.includes('mirror') || itemLower.includes('vision')) return mirrorImage;
  if (itemLower.includes('fuel') || itemLower.includes('gas')) return fuelImage;
  if (itemLower.includes('battery') || itemLower.includes('electrical')) return batteryImage;
  if (itemLower.includes('winch') || itemLower.includes('cable')) return winchImage;
  if (itemLower.includes('boom') || itemLower.includes('arm')) return craneImage;
  if (itemLower.includes('track') || itemLower.includes('chain')) return trackImage;
  
  // Category-based fallbacks
  if (categoryLower.includes('crane') || categoryLower.includes('mobile')) return craneImage;
  if (categoryLower.includes('engine') || categoryLower.includes('mechanical')) return engineImage;
  if (categoryLower.includes('safety') || categoryLower.includes('warning')) return safetyImage;
  if (categoryLower.includes('electrical') || categoryLower.includes('control')) return batteryImage;
  if (categoryLower.includes('hydraulic') || categoryLower.includes('fluid')) return hydraulicImage;
  
  // Default fallback
  return defaultImage;
};

export const DefaultEquipmentImage: React.FC<DefaultEquipmentImageProps> = ({
  category,
  itemText,
  className = "h-12 w-12",
}) => {
  const imageSrc = getDefaultImage(category, itemText);
  
  return (
    <img
      src={imageSrc}
      alt={`${category} - ${itemText}`}
      className={`${className} object-cover rounded border`}
    />
  );
};