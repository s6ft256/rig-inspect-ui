import React from 'react';

interface DefaultEquipmentImageProps {
  category: string;
  itemText: string;
  className?: string;
}

// Map of equipment categories to real Pexels images that specifically match the descriptions
const getDefaultImage = (category: string, itemText: string): string => {
  const categoryLower = category.toLowerCase();
  const itemLower = itemText.toLowerCase();
  
  // PRE-OPERATIONAL DOCUMENTATION
  if (itemLower.includes('documents') || itemLower.includes('logs')) {
    return 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // ENGINE & POWER UNIT
  if (itemLower.includes('engine condition') || (itemLower.includes('engine') && itemLower.includes('leaks'))) {
    return 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('fluid levels') || (itemLower.includes('oil') && itemLower.includes('coolant'))) {
    return 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('battery connection') || itemLower.includes('battery condition')) {
    return 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('air filter condition')) {
    return 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // OPERATOR STATION
  if (itemLower.includes('operator cabin') || (itemLower.includes('cabin') && itemLower.includes('glass'))) {
    return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('seat') && itemLower.includes('seatbelt')) {
    return 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('operator controls functional')) {
    return 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('lights') && itemLower.includes('gauges') && itemLower.includes('signals')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('horn') && itemLower.includes('alarms')) {
    return 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // CHASSIS & UNDERCARRIAGE
  if (itemLower.includes('roller') && itemLower.includes('track')) {
    return 'https://images.pexels.com/photos/1078883/pexels-photo-1078883.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('tire pressure') && itemLower.includes('condition')) {
    return 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('brakes') && itemLower.includes('parking brake')) {
    return 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('abnormal noises') || itemLower.includes('vibrations')) {
    return 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // ATTACHMENTS & HYDRAULICS
  if (itemLower.includes('bucket condition') && itemLower.includes('cracks')) {
    return 'https://images.pexels.com/photos/1078885/pexels-photo-1078885.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('hydraulic system') && itemLower.includes('hoses')) {
    return 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('safety guards') && itemLower.includes('shields')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('attachment pins') && itemLower.includes('locks')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // FINAL CHECKS
  if (itemLower.includes('cleanliness') && itemLower.includes('debris')) {
    return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('fire extinguisher')) {
    return 'https://images.pexels.com/photos/618200/pexels-photo-618200.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('first aid kit')) {
    return 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // MOBILE CRANE SPECIFIC IMAGES
  
  // HOIST & HOOK SYSTEMS
  if (itemLower.includes('main hoist line') && itemLower.includes('hook')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('auxiliary hoist') || itemLower.includes('swinger hook')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // BOOM & STRUCTURAL
  if (itemLower.includes('boom') && itemLower.includes('jib') && itemLower.includes('cracks')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('lattice sections') && itemLower.includes('pins')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('slew ring') && itemLower.includes('gear')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // STABILITY & SUPPORT
  if (itemLower.includes('outriggers') && itemLower.includes('pads')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('crane levelness')) {
    return 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // SAFETY SYSTEMS
  if (itemLower.includes('load moment indicator') || itemLower.includes('lmi')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('anti-two-block')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // WIRE ROPE & RIGGING
  if (itemLower.includes('wire rope') && itemLower.includes('birdcaging')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (itemLower.includes('rigging equipment')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  // Category-based fallbacks for better matching
  if (categoryLower.includes('hoist') || categoryLower.includes('hook')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('boom') || categoryLower.includes('structural')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('stability') || categoryLower.includes('support')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('safety systems')) {
    return 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('wire rope') || categoryLower.includes('rigging')) {
    return 'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('engine') || categoryLower.includes('power')) {
    return 'https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('operator') || categoryLower.includes('station')) {
    return 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('chassis') || categoryLower.includes('undercarriage')) {
    return 'https://images.pexels.com/photos/1078883/pexels-photo-1078883.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('attachments') || categoryLower.includes('hydraulics')) {
    return 'https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=400';
  }
  
  if (categoryLower.includes('final')) {
    return 'https://images.pexels.com/photos/618200/pexels-photo-618200.jpeg?auto=compress&cs=tinysrgb&w=400';
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