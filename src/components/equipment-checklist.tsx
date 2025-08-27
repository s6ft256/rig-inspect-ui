import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Calendar, User, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/image/ImageUpload";
import { DefaultEquipmentImage } from "@/components/image/DefaultEquipmentImages";

type EquipmentType = "general" | "crane";
type CheckStatus = "unchecked" | "passed" | "failed";

interface ChecklistItem {
  id: string;
  text: string;
  status: CheckStatus;
  imageUrl?: string;
}

interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

interface SubmittedChecklist {
  id: string;
  operatorName: string;
  licenseNumber: string;
  equipmentType: string;
  equipmentNumber: string;
  date: string;
  checklistType: "general" | "crane";
  score: number;
  passedItems: number;
  failedItems: number;
  totalItems: number;
  categories: ChecklistCategory[];
  submittedAt: string;
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
  const [submittedChecklists, setSubmittedChecklists] = useState<SubmittedChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to handle image upload for checklist items
  const handleImageUpload = (categoryIndex: number, itemIndex: number, imageUrl: string) => {
    const newChecklist = [...currentChecklist];
    newChecklist[categoryIndex].items[itemIndex].imageUrl = imageUrl;
    setCurrentChecklist(newChecklist);
  };

  // Load submitted checklists from Supabase on component mount
  useEffect(() => {
    loadSubmittedChecklists();
  }, []);

  const loadSubmittedChecklists = async () => {
    try {
      const { data: checklists, error: checklistsError } = await supabase
        .from('checklists')
        .select(`
          *,
          checklist_items (
            category_title,
            item_id,
            item_text,
            status,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (checklistsError) {
        console.error('Error loading checklists:', checklistsError);
        toast({
          title: "Error",
          description: "Failed to load submitted checklists",
          variant: "destructive"
        });
        return;
      }

      if (checklists) {
        const formattedChecklists: SubmittedChecklist[] = checklists.map(checklist => {
          // Group items by category
          const categoriesMap = new Map<string, ChecklistItem[]>();
          
          checklist.checklist_items.forEach((item: any) => {
            if (!categoriesMap.has(item.category_title)) {
              categoriesMap.set(item.category_title, []);
            }
            categoriesMap.get(item.category_title)!.push({
              id: item.item_id,
              text: item.item_text,
              status: item.status as CheckStatus,
              imageUrl: item.image_url || undefined
            });
          });

          const categories: ChecklistCategory[] = Array.from(categoriesMap.entries()).map(([title, items]) => ({
            title,
            items
          }));

          return {
            id: checklist.id,
            operatorName: checklist.operator_name,
            licenseNumber: checklist.license_number,
            equipmentType: checklist.equipment_type,
            equipmentNumber: checklist.equipment_number,
            date: checklist.inspection_date,
            checklistType: checklist.checklist_type,
            score: checklist.score,
            passedItems: checklist.passed_items,
            failedItems: checklist.failed_items,
            totalItems: checklist.total_items,
            categories,
            submittedAt: checklist.created_at
          };
        });

        setSubmittedChecklists(formattedChecklists);
      }
    } catch (error) {
      console.error('Error loading checklists:', error);
      toast({
        title: "Error",
        description: "Failed to load submitted checklists",
        variant: "destructive"
      });
    }
  };

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

  const handleSubmit = async () => {
    if (!equipmentNumber || !operatorName || !licenseNumber || !equipmentType || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { passedItems, failedItems, totalItems, score } = calculateScore();

      // Insert the main checklist record
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklists')
        .insert({
          operator_name: operatorName,
          license_number: licenseNumber,
          equipment_type: equipmentType,
          equipment_number: equipmentNumber,
          inspection_date: date,
          checklist_type: activeTab,
          score,
          passed_items: passedItems,
          failed_items: failedItems,
          total_items: totalItems
        })
        .select()
        .single();

      if (checklistError) {
        console.error('Error inserting checklist:', checklistError);
        toast({
          title: "Error",
          description: "Failed to submit checklist",
          variant: "destructive"
        });
        return;
      }

      // Insert all checklist items
      const checklistItems = currentChecklist.flatMap(category =>
        category.items.map(item => ({
          checklist_id: checklistData.id,
          category_title: category.title,
          item_id: item.id,
          item_text: item.text,
          status: item.status,
          image_url: item.imageUrl || null
        }))
      );

      const { error: itemsError } = await supabase
        .from('checklist_items')
        .insert(checklistItems);

      if (itemsError) {
        console.error('Error inserting checklist items:', itemsError);
        toast({
          title: "Error",
          description: "Failed to submit checklist items",
          variant: "destructive"
        });
        return;
      }

      // Reset form
      setEquipmentNumber("");
      setOperatorName("");
      setLicenseNumber("");
      setEquipmentType("");
      setDate("");
      setGeneralChecklist(generalEquipmentChecklist.map(category => ({
        ...category,
        items: category.items.map(item => ({ ...item, status: "unchecked" as CheckStatus }))
      })));
      setCraneChecklistState(craneChecklist.map(category => ({
        ...category,
        items: category.items.map(item => ({ ...item, status: "unchecked" as CheckStatus }))
      })));

      // Reload submitted checklists
      await loadSubmittedChecklists();

      toast({
        title: "Report Submitted",
        description: `Inspection complete: ${passedItems} passed, ${failedItems} failed, ${totalItems - passedItems - failedItems} unchecked. Score: ${score}%`,
      });

    } catch (error) {
      console.error('Error submitting checklist:', error);
      toast({
        title: "Error",
        description: "Failed to submit checklist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-wide">
            DAILY EQUIPMENT INSPECTION
          </h1>
        </div>

        <Tabs defaultValue="new-inspection" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="new-inspection" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              New Inspection
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General Equipment
            </TabsTrigger>
            <TabsTrigger value="crane" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Mobile Crane
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Submitted ({submittedChecklists.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-inspection">
            <Card className="bg-card border-border shadow-elevated">
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-foreground mb-4">Select Equipment Type</h2>
                <p className="text-muted-foreground mb-6">Choose the type of equipment you want to inspect</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveTab("general")}
                    className="h-24 text-lg"
                  >
                    General Heavy Equipment
                  </Button>
                  <Button
                    onClick={() => setActiveTab("crane")}
                    className="h-24 text-lg"
                  >
                    Mobile Crane
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            {renderInspectionForm("general")}
          </TabsContent>

          <TabsContent value="crane">
            {renderInspectionForm("crane")}
          </TabsContent>

          <TabsContent value="submitted">
            <Card className="bg-card border-border shadow-elevated">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Submitted Checklists ({submittedChecklists.length})
                  </h2>
                </div>
                
                {submittedChecklists.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No submitted checklists yet</p>
                    <p className="text-muted-foreground/70 text-sm mt-2">Complete an inspection to see it here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {submittedChecklists.map((checklist) => (
                        <div key={checklist.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-industrial-blue" />
                                <span className="font-medium text-industrial-white">{checklist.operatorName}</span>
                                <span className="text-industrial-grey">({checklist.licenseNumber})</span>
                              </div>
                              <div className="text-sm text-industrial-grey space-y-1">
                                <div>{checklist.equipmentType} - #{checklist.equipmentNumber}</div>
                                <div className="flex items-center gap-2">
                                  <span>Date: {checklist.date}</span>
                                  <span>•</span>
                                  <span>Type: {checklist.checklistType === "general" ? "General Equipment" : "Mobile Crane"}</span>
                                </div>
                                <div>Submitted: {new Date(checklist.submittedAt).toLocaleDateString()} at {new Date(checklist.submittedAt).toLocaleTimeString()}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className={`text-2xl font-bold ${checklist.score >= 80 ? 'text-industrial-green' : checklist.score >= 60 ? 'text-yellow-500' : 'text-destructive'}`}>
                                  {checklist.score}%
                                </div>
                                <div className="text-xs text-industrial-grey">Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-industrial-green">{checklist.passedItems}</div>
                                <div className="text-xs text-industrial-grey">Passed</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-destructive">{checklist.failedItems}</div>
                                <div className="text-xs text-industrial-grey">Failed</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  function renderInspectionForm(type: EquipmentType) {
    const checklist = type === "general" ? generalChecklist : craneChecklistState;
    const setChecklist = type === "general" ? setGeneralChecklist : setCraneChecklistState;
    
    const handleStatusChange = (categoryIndex: number, itemIndex: number, newStatus: CheckStatus) => {
      const newChecklist = [...checklist];
      newChecklist[categoryIndex].items[itemIndex].status = newStatus;
      setChecklist(newChecklist);
    };

    const calculateScore = () => {
      const totalItems = checklist.reduce((acc, category) => acc + category.items.length, 0);
      const passedItems = checklist.reduce((acc, category) => 
        acc + category.items.filter(item => item.status === "passed").length, 0
      );
      const failedItems = checklist.reduce((acc, category) => 
        acc + category.items.filter(item => item.status === "failed").length, 0
      );
      const checkedItems = passedItems + failedItems;
      const score = checkedItems > 0 ? Math.round((passedItems / checkedItems) * 100) : 0;
      
      return { totalItems, passedItems, failedItems, checkedItems, score };
    };

    return (

      <Card className="bg-card border-border shadow-elevated">
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
                Inspection Checklist - {type === "general" ? "General Equipment" : "Mobile Crane"}
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
                {checklist.map((category, categoryIndex) => (
                  <div key={category.title} className="space-y-3">
                    <h3 className="text-industrial-white font-semibold text-sm uppercase tracking-wider">
                      {category.title}
                    </h3>
                     <div className="space-y-2">
                       {category.items.map((item, itemIndex) => (
                         <div key={item.id} className="flex items-center gap-4 py-3 px-4 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                           <div className="flex-shrink-0">
                             {item.imageUrl ? (
                               <img
                                 src={item.imageUrl}
                                 alt={item.text}
                                 className="h-12 w-12 object-cover rounded border"
                               />
                             ) : (
                               <DefaultEquipmentImage
                                 category={category.title}
                                 itemText={item.text}
                                 className="h-12 w-12"
                               />
                             )}
                           </div>
                           <div className="flex-1">
                             <span className="text-industrial-grey">
                               {item.text}
                             </span>
                           </div>
                           <div className="flex items-center gap-2">
                             <ImageUpload
                               onImageUpload={(imageUrl) => {
                                 const newChecklist = [...checklist];
                                 newChecklist[categoryIndex].items[itemIndex].imageUrl = imageUrl;
                                 setChecklist(newChecklist);
                               }}
                               currentImageUrl={item.imageUrl}
                               itemId={`${type}-${category.title}-${item.id}`}
                             />
                           </div>
                           <div className="flex items-center gap-3">
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
              onClick={() => {
                // Set the activeTab to match the current form type
                setActiveTab(type);
                handleSubmit();
              }}
              disabled={isLoading}
              className="bg-industrial-green hover:bg-industrial-green/90 text-white font-semibold py-3 px-8 text-lg shadow-elevated disabled:opacity-50"
              size="lg"
            >
              {isLoading ? "SUBMITTING..." : "SUBMIT REPORT"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}