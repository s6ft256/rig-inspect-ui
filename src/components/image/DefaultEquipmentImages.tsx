import React from 'react';

interface DefaultEquipmentImageProps {
  category: string;
  itemText: string;
  className?: string;
}

// Map of equipment categories to real Pexels images
const getDefaultImage = (category: string, itemText: string): string => {
  const categoryLower = category.toLowerCase();
  const itemLower = itemText.toLowerCase();
  
  // General Equipment Images (Excavator/Heavy Equipment)
  if (itemLower.includes('engine') || itemLower.includes('motor')) {
    return 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('hydraulic') || itemLower.includes('fluid')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('battery') || itemLower.includes('electrical')) {
    return 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('air filter') || itemLower.includes('filter')) {
    return 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('cabin') || itemLower.includes('glass')) {
    return 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('seat') || itemLower.includes('seatbelt')) {
    return 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('controls') || itemLower.includes('operator')) {
    return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('lights') || itemLower.includes('gauges') || itemLower.includes('signals')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('horn') || itemLower.includes('alarm')) {
    return 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('track') || itemLower.includes('roller')) {
    return 'https://images.pexels.com/photos/1078883/pexels-photo-1078883.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('tire') || itemLower.includes('wheel')) {
    return 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('brake') || itemLower.includes('parking')) {
    return 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('bucket') || itemLower.includes('attachment')) {
    return 'https://images.pexels.com/photos/1078885/pexels-photo-1078885.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('guards') || itemLower.includes('shields')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('pins') || itemLower.includes('locks')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('fire extinguisher') || itemLower.includes('extinguisher')) {
    return 'https://images.pexels.com/photos/618200/pexels-photo-618200.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('first aid') || itemLower.includes('aid kit')) {
    return 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('documents') || itemLower.includes('logs')) {
    return 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // Mobile Crane Specific Images
  if (itemLower.includes('hoist') || itemLower.includes('hook')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('boom') || itemLower.includes('jib')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('lattice') || itemLower.includes('sections')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('slew ring') || itemLower.includes('gear')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('outriggers') || itemLower.includes('pads')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('levelness') || itemLower.includes('level')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('lmi') || itemLower.includes('load moment')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('anti-two-block') || itemLower.includes('two-block')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('wire rope') || itemLower.includes('birdcaging')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('rigging') || itemLower.includes('rigging equipment')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // Category-based fallbacks
  if (categoryLower.includes('crane') || categoryLower.includes('mobile')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('engine') || categoryLower.includes('power')) {
    return 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('operator') || categoryLower.includes('station')) {
    return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('chassis') || categoryLower.includes('undercarriage')) {
    return 'https://images.pexels.com/photos/1078883/pexels-photo-1078883.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('attachments') || categoryLower.includes('hydraulics')) {
    return 'https://images.pexels.com/photos/1078885/pexels-photo-1078885.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('safety') || categoryLower.includes('final')) {
    return 'https://images.pexels.com/photos/618200/pexels-photo-618200.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('hoist') || categoryLower.includes('hook')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('boom') || categoryLower.includes('structural')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('stability') || categoryLower.includes('support')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('wire rope') || categoryLower.includes('rigging')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // Default fallback - general heavy equipment
  return 'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=400';
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