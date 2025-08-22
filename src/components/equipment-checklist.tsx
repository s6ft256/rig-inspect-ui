import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

type EquipmentType = "general" | "crane";
type CheckStatus = "unchecked" | "passed" | "failed";

interface ChecklistItem {
  id: string;
  text: string;
  status: CheckStatus;
}

interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

const generalEquipmentChecklist: ChecklistCategory[] = [
  {
    title: "PRE-OPERATIONAL DOCUMENTATION",
    items: [
      { id: "docs", text: "Documents & Logs (in order)", status: "unchecked" }
    ]
  },
  {
    title: "ENGINE & POWER UNIT",
    items: [
      { id: "engine", text: "Engine Condition (no leaks, noises)", status: "unchecked" },
      { id: "fluids", text: "Fluid Levels (Oil, Coolant, Hydraulic)", status: "unchecked" },
      { id: "battery", text: "Battery Connection & Condition", status: "unchecked" },
      { id: "air-filter", text: "Air Filter Condition", status: "unchecked" }
    ]
  },
  {
    title: "OPERATOR STATION",
    items: [
      { id: "cabin", text: "Operator Cabin (clean, glass intact)", status: "unchecked" },
      { id: "seat", text: "Seat & Seatbelt Function", status: "unchecked" },
      { id: "controls", text: "Operator Controls Functional", status: "unchecked" },
      { id: "lights", text: "Lights, Gauges & Signals Operational", status: "unchecked" },
      { id: "horn", text: "Horn & Alarms Functional", status: "unchecked" }
    ]
  },
  {
    title: "CHASSIS & UNDERCARRIAGE",
    items: [
      { id: "tracks", text: "Roller & Track Condition (if applicable)", status: "unchecked" },
      { id: "tires", text: "Tire Pressure & Condition (including wear)", status: "unchecked" },
      { id: "brakes", text: "Brakes & Parking Brake", status: "unchecked" },
      { id: "noises", text: "No Abnormal Noises or Vibrations", status: "unchecked" }
    ]
  },
  {
    title: "ATTACHMENTS & HYDRAULICS",
    items: [
      { id: "bucket", text: "Bucket Condition (if equipped, for cracks/wear)", status: "unchecked" },
      { id: "hydraulic", text: "Hydraulic System (no leaks, hoses intact)", status: "unchecked" },
      { id: "guards", text: "Safety Guards & Shields in Place", status: "unchecked" },
      { id: "pins", text: "Attachment Pins & Locks Secure", status: "unchecked" }
    ]
  },
  {
    title: "FINAL CHECKS",
    items: [
      { id: "clean", text: "Cleanliness & Free of Debris", status: "unchecked" },
      { id: "extinguisher", text: "Fire Extinguisher Present & Charged", status: "unchecked" },
      { id: "first-aid", text: "First Aid Kit Present", status: "unchecked" }
    ]
  }
];

const craneChecklist: ChecklistCategory[] = [
  {
    title: "HOIST & HOOK SYSTEMS",
    items: [
      { id: "main-hoist", text: "Main Hoist Line & Hook (for damage)", status: "unchecked" },
      { id: "aux-hoist", text: "Auxiliary Hoist (Swinger Hook)", status: "unchecked" }
    ]
  },
  {
    title: "BOOM & STRUCTURAL",
    items: [
      { id: "boom-jib", text: "Boom & Jib (for cracks, deformities)", status: "unchecked" },
      { id: "lattice", text: "Lattice Sections & Pins", status: "unchecked" },
      { id: "slew-ring", text: "Slew Ring & Gear Condition", status: "unchecked" }
    ]
  },
  {
    title: "STABILITY & SUPPORT",
    items: [
      { id: "outriggers", text: "Outriggers & Pads (fully extended/retracted)", status: "unchecked" },
      { id: "levelness", text: "Crane Levelness Check", status: "unchecked" }
    ]
  },
  {
    title: "SAFETY SYSTEMS",
    items: [
      { id: "lmi", text: "Load Moment Indicator (LMI) Calibration", status: "unchecked" },
      { id: "anti-two-block", text: "Anti-Two-Block System Test", status: "unchecked" }
    ]
  },
  {
    title: "WIRE ROPE & RIGGING",
    items: [
      { id: "wire-rope", text: "Wire Rope (for birdcaging, kinks)", status: "unchecked" },
      { id: "rigging", text: "Rigging Equipment Inspection (separate log)", status: "unchecked" }
    ]
  }
];

interface CheckboxButtonProps {
  status: CheckStatus;
  onClick: () => void;
  type: "pass" | "fail";
}

function CheckboxButton({ status, onClick, type }: CheckboxButtonProps) {
  const isActive = (type === "pass" && status === "passed") || (type === "fail" && status === "failed");
  
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all duration-200 ${
        isActive
          ? type === "pass"
            ? "bg-industrial-green border-industrial-green text-white shadow-sm"
            : "bg-destructive border-destructive text-white shadow-sm"
          : "border-border hover:border-industrial-blue bg-background"
      }`}
    >
      {isActive && (
        type === "pass" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
      )}
    </button>
  );
}

export default function EquipmentChecklist() {
  const [activeTab, setActiveTab] = useState<EquipmentType>("general");
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [date, setDate] = useState("");
  const [generalChecklist, setGeneralChecklist] = useState(generalEquipmentChecklist);
  const [craneChecklistState, setCraneChecklistState] = useState(craneChecklist);
  const { toast } = useToast();

  const currentChecklist = activeTab === "general" ? generalChecklist : craneChecklistState;
  const setCurrentChecklist = activeTab === "general" ? setGeneralChecklist : setCraneChecklistState;

  const handleStatusChange = (categoryIndex: number, itemIndex: number, newStatus: CheckStatus) => {
    const newChecklist = [...currentChecklist];
    newChecklist[categoryIndex].items[itemIndex].status = newStatus;
    setCurrentChecklist(newChecklist);
  };

  const calculateScore = () => {
    const totalItems = currentChecklist.reduce((acc, category) => acc + category.items.length, 0);
    const passedItems = currentChecklist.reduce((acc, category) => 
      acc + category.items.filter(item => item.status === "passed").length, 0
    );
    const failedItems = currentChecklist.reduce((acc, category) => 
      acc + category.items.filter(item => item.status === "failed").length, 0
    );
    const checkedItems = passedItems + failedItems;
    const score = checkedItems > 0 ? Math.round((passedItems / checkedItems) * 100) : 0;
    
    return { totalItems, passedItems, failedItems, checkedItems, score };
  };

  const handleSubmit = () => {
    if (!equipmentNumber || !operatorName || !licenseNumber || !equipmentType || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const { passedItems, failedItems, totalItems, score } = calculateScore();

    toast({
      title: "Report Submitted",
      description: `Inspection complete: ${passedItems} passed, ${failedItems} failed, ${totalItems - passedItems - failedItems} unchecked. Score: ${score}%`,
    });
  };

  return (
    <div className="min-h-screen bg-industrial-charcoal p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="operator-name" className="text-industrial-white font-medium">
                  Operator Name:
                </Label>
                <Input
                  id="operator-name"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-industrial-blue focus:border-industrial-blue"
                  placeholder="Enter operator name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-number" className="text-industrial-white font-medium">
                  License Number:
                </Label>
                <Input
                  id="license-number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-industrial-blue focus:border-industrial-blue"
                  placeholder="Enter license number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment-type" className="text-industrial-white font-medium">
                  Equipment Type:
                </Label>
                <Input
                  id="equipment-type"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="bg-input border-border text-foreground focus:ring-industrial-blue focus:border-industrial-blue"
                  placeholder="Enter equipment type"
                />
              </div>
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

            {/* Equipment Score Dashboard */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-industrial-blue">{calculateScore().score}%</div>
                  <div className="text-sm text-industrial-grey">Equipment Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-industrial-green">{calculateScore().passedItems}</div>
                  <div className="text-sm text-industrial-grey">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-destructive">{calculateScore().failedItems}</div>
                  <div className="text-sm text-industrial-grey">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-industrial-white">{calculateScore().totalItems - calculateScore().checkedItems}</div>
                  <div className="text-sm text-industrial-grey">Remaining</div>
                </div>
              </div>
            </div>

            {/* Inspection Checklist */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-industrial-white">
                  Inspection Checklist
                </h2>
                <div className="flex items-center gap-6 text-sm text-industrial-grey">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-industrial-green bg-industrial-green flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-destructive bg-destructive flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </div>
                    <span>Fail</span>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-6">
                  {currentChecklist.map((category, categoryIndex) => (
                    <div key={category.title} className="space-y-3">
                      <h3 className="text-industrial-white font-semibold text-sm uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center justify-between py-3 px-4 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                            <span className="text-industrial-grey flex-1">
                              {item.text}
                            </span>
                            <div className="flex items-center gap-3 ml-4">
                              <CheckboxButton
                                status={item.status}
                                onClick={() => handleStatusChange(categoryIndex, itemIndex, 
                                  item.status === "passed" ? "unchecked" : "passed"
                                )}
                                type="pass"
                              />
                              <CheckboxButton
                                status={item.status}
                                onClick={() => handleStatusChange(categoryIndex, itemIndex, 
                                  item.status === "failed" ? "unchecked" : "failed"
                                )}
                                type="fail"
                              />
                            </div>
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