import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type EquipmentType = "general" | "crane";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

const generalEquipmentChecklist: ChecklistCategory[] = [
  {
    title: "PRE-OPERATIONAL DOCUMENTATION",
    items: [
      { id: "docs", text: "Documents & Logs (in order)", checked: false }
    ]
  },
  {
    title: "ENGINE & POWER UNIT",
    items: [
      { id: "engine", text: "Engine Condition (no leaks, noises)", checked: false },
      { id: "fluids", text: "Fluid Levels (Oil, Coolant, Hydraulic)", checked: false },
      { id: "battery", text: "Battery Connection & Condition", checked: false },
      { id: "air-filter", text: "Air Filter Condition", checked: false }
    ]
  },
  {
    title: "OPERATOR STATION",
    items: [
      { id: "cabin", text: "Operator Cabin (clean, glass intact)", checked: false },
      { id: "seat", text: "Seat & Seatbelt Function", checked: false },
      { id: "controls", text: "Operator Controls Functional", checked: false },
      { id: "lights", text: "Lights, Gauges & Signals Operational", checked: false },
      { id: "horn", text: "Horn & Alarms Functional", checked: false }
    ]
  },
  {
    title: "CHASSIS & UNDERCARRIAGE",
    items: [
      { id: "tracks", text: "Roller & Track Condition (if applicable)", checked: false },
      { id: "tires", text: "Tire Pressure & Condition (including wear)", checked: false },
      { id: "brakes", text: "Brakes & Parking Brake", checked: false },
      { id: "noises", text: "No Abnormal Noises or Vibrations", checked: false }
    ]
  },
  {
    title: "ATTACHMENTS & HYDRAULICS",
    items: [
      { id: "bucket", text: "Bucket Condition (if equipped, for cracks/wear)", checked: false },
      { id: "hydraulic", text: "Hydraulic System (no leaks, hoses intact)", checked: false },
      { id: "guards", text: "Safety Guards & Shields in Place", checked: false },
      { id: "pins", text: "Attachment Pins & Locks Secure", checked: false }
    ]
  },
  {
    title: "FINAL CHECKS",
    items: [
      { id: "clean", text: "Cleanliness & Free of Debris", checked: false },
      { id: "extinguisher", text: "Fire Extinguisher Present & Charged", checked: false },
      { id: "first-aid", text: "First Aid Kit Present", checked: false }
    ]
  }
];

const craneChecklist: ChecklistCategory[] = [
  {
    title: "HOIST & HOOK SYSTEMS",
    items: [
      { id: "main-hoist", text: "Main Hoist Line & Hook (for damage)", checked: false },
      { id: "aux-hoist", text: "Auxiliary Hoist (Swinger Hook)", checked: false }
    ]
  },
  {
    title: "BOOM & STRUCTURAL",
    items: [
      { id: "boom-jib", text: "Boom & Jib (for cracks, deformities)", checked: false },
      { id: "lattice", text: "Lattice Sections & Pins", checked: false },
      { id: "slew-ring", text: "Slew Ring & Gear Condition", checked: false }
    ]
  },
  {
    title: "STABILITY & SUPPORT",
    items: [
      { id: "outriggers", text: "Outriggers & Pads (fully extended/retracted)", checked: false },
      { id: "levelness", text: "Crane Levelness Check", checked: false }
    ]
  },
  {
    title: "SAFETY SYSTEMS",
    items: [
      { id: "lmi", text: "Load Moment Indicator (LMI) Calibration", checked: false },
      { id: "anti-two-block", text: "Anti-Two-Block System Test", checked: false }
    ]
  },
  {
    title: "WIRE ROPE & RIGGING",
    items: [
      { id: "wire-rope", text: "Wire Rope (for birdcaging, kinks)", checked: false },
      { id: "rigging", text: "Rigging Equipment Inspection (separate log)", checked: false }
    ]
  }
];

export default function EquipmentChecklist() {
  const [activeTab, setActiveTab] = useState<EquipmentType>("general");
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [date, setDate] = useState("");
  const [generalChecklist, setGeneralChecklist] = useState(generalEquipmentChecklist);
  const [craneChecklistState, setCraneChecklistState] = useState(craneChecklist);
  const { toast } = useToast();

  const currentChecklist = activeTab === "general" ? generalChecklist : craneChecklistState;
  const setCurrentChecklist = activeTab === "general" ? setGeneralChecklist : setCraneChecklistState;

  const handleCheckboxChange = (categoryIndex: number, itemIndex: number) => {
    const newChecklist = [...currentChecklist];
    newChecklist[categoryIndex].items[itemIndex].checked = 
      !newChecklist[categoryIndex].items[itemIndex].checked;
    setCurrentChecklist(newChecklist);
  };

  const handleSubmit = () => {
    if (!equipmentNumber || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in equipment number and date",
        variant: "destructive"
      });
      return;
    }

    const totalItems = currentChecklist.reduce((acc, category) => acc + category.items.length, 0);
    const checkedItems = currentChecklist.reduce((acc, category) => 
      acc + category.items.filter(item => item.checked).length, 0
    );

    toast({
      title: "Report Submitted",
      description: `Inspection complete: ${checkedItems}/${totalItems} items checked`,
    });
  };

  return (
    <div className="min-h-screen bg-industrial-charcoal p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-industrial-white tracking-wide">
            DAILY EQUIPMENT INSPECTION
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-secondary rounded-lg p-1 shadow-soft">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
              activeTab === "general"
                ? "bg-industrial-blue text-industrial-white shadow-glow-blue"
                : "text-industrial-grey hover:text-industrial-white"
            }`}
          >
            General Heavy Equipment
          </button>
          <button
            onClick={() => setActiveTab("crane")}
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-200 ${
              activeTab === "crane"
                ? "bg-industrial-blue text-industrial-white shadow-glow-blue"
                : "text-industrial-grey hover:text-industrial-white"
            }`}
          >
            Mobile Crane
          </button>
        </div>

        {/* Main Form Card */}
        <Card className="bg-industrial-card border-border shadow-elevated">
          <div className="p-6">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="equipment-number" className="text-industrial-white font-medium">
                  Equipment Number:
                </Label>
                <Input
                  id="equipment-number"
                  value={equipmentNumber}
                  onChange={(e) => setEquipmentNumber(e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-industrial-blue focus:border-industrial-blue"
                  placeholder="Enter equipment number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="text-industrial-white font-medium">
                  Date:
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-industrial-blue focus:border-industrial-blue"
                />
              </div>
            </div>

            {/* Inspection Checklist */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-industrial-white mb-4">
                Inspection Checklist
              </h2>
              
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-6">
                  {currentChecklist.map((category, categoryIndex) => (
                    <div key={category.title} className="space-y-3">
                      <h3 className="text-industrial-white font-semibold text-sm uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-industrial-grey flex-1">
                              {item.text}
                            </span>
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => handleCheckboxChange(categoryIndex, itemIndex)}
                              className="ml-4 data-[state=checked]:bg-industrial-blue data-[state=checked]:border-industrial-blue"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className="bg-industrial-green hover:bg-industrial-green/90 text-white font-semibold py-3 px-8 text-lg shadow-elevated"
                size="lg"
              >
                SUBMIT REPORT
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}