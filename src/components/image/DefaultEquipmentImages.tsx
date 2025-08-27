import React from 'react';

interface DefaultEquipmentImageProps {
  category: string;
  itemText: string;
  className?: string;
}

// Map of equipment categories to default icons/images
const getDefaultIcon = (category: string, itemText: string): string => {
  const categoryLower = category.toLowerCase();
  const itemLower = itemText.toLowerCase();
  
  // Equipment-specific icons
  if (itemLower.includes('engine') || itemLower.includes('motor')) return '🔧';
  if (itemLower.includes('hydraulic') || itemLower.includes('fluid')) return '🛠️';
  if (itemLower.includes('brake') || itemLower.includes('stop')) return '🛑';
  if (itemLower.includes('light') || itemLower.includes('beam')) return '💡';
  if (itemLower.includes('tire') || itemLower.includes('wheel')) return '🛞';
  if (itemLower.includes('seat') || itemLower.includes('belt')) return '🪑';
  if (itemLower.includes('fire') || itemLower.includes('extinguisher')) return '🧯';
  if (itemLower.includes('horn') || itemLower.includes('alarm')) return '📯';
  if (itemLower.includes('mirror') || itemLower.includes('vision')) return '🪞';
  if (itemLower.includes('fuel') || itemLower.includes('gas')) return '⛽';
  if (itemLower.includes('battery') || itemLower.includes('electrical')) return '🔋';
  if (itemLower.includes('winch') || itemLower.includes('cable')) return '⚙️';
  if (itemLower.includes('boom') || itemLower.includes('arm')) return '🏗️';
  if (itemLower.includes('track') || itemLower.includes('chain')) return '🔗';
  
  // Category-based fallbacks
  if (categoryLower.includes('crane') || categoryLower.includes('mobile')) return '🏗️';
  if (categoryLower.includes('engine') || categoryLower.includes('mechanical')) return '⚙️';
  if (categoryLower.includes('safety') || categoryLower.includes('warning')) return '⚠️';
  if (categoryLower.includes('electrical') || categoryLower.includes('control')) return '⚡';
  if (categoryLower.includes('hydraulic') || categoryLower.includes('fluid')) return '🛠️';
  
  // Default fallback
  return '📋';
};

export const DefaultEquipmentImage: React.FC<DefaultEquipmentImageProps> = ({
  category,
  itemText,
  className = "h-12 w-12",
}) => {
  const icon = getDefaultIcon(category, itemText);
  
  return (
    <div className={`${className} flex items-center justify-center bg-muted rounded border text-2xl`}>
      {icon}
    </div>
  );
};