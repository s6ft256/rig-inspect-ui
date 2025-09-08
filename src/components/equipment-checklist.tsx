import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './image/ImageUpload';
import { Check, X, Calendar, User, FileText, Star, Loader2 } from 'lucide-react';

type CheckStatus = 'unchecked' | 'passed' | 'failed';
type EquipmentType = 'general' | 'mobile_crane';

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
  inspection_date: string;
  checklist_type: EquipmentType;
  operator_name: string;
  license_number: string;
  equipment_type: string;
  equipment_number: string;
  score: number;
  passed_items: number;
  failed_items: number;
  total_items: number;
  created_at: string;
}

// Predefined checklists
const generalEquipmentChecklist: ChecklistCategory[] = [
  {
    title: "Engine and Power",
    items: [
      { id: "engine_1", text: "Engine oil level and condition", status: "unchecked" },
      { id: "engine_2", text: "Coolant level and condition", status: "unchecked" },
      { id: "engine_3", text: "Air filter condition", status: "unchecked" },
      { id: "engine_4", text: "Fuel level and fuel system", status: "unchecked" },
      { id: "engine_5", text: "Battery condition and terminals", status: "unchecked" },
    ]
  },
  {
    title: "Hydraulic System",
    items: [
      { id: "hydraulic_1", text: "Hydraulic fluid level", status: "unchecked" },
      { id: "hydraulic_2", text: "Hydraulic hoses and connections", status: "unchecked" },
      { id: "hydraulic_3", text: "Hydraulic pump operation", status: "unchecked" },
      { id: "hydraulic_4", text: "Cylinder operation and seals", status: "unchecked" },
    ]
  },
  {
    title: "Safety Systems",
    items: [
      { id: "safety_1", text: "Seat belt condition and operation", status: "unchecked" },
      { id: "safety_2", text: "ROPS/FOPS structure", status: "unchecked" },
      { id: "safety_3", text: "Warning lights and alarms", status: "unchecked" },
      { id: "safety_4", text: "Fire extinguisher present and charged", status: "unchecked" },
      { id: "safety_5", text: "Emergency stops functioning", status: "unchecked" },
    ]
  },
  {
    title: "Tracks/Tires and Undercarriage",
    items: [
      { id: "tracks_1", text: "Track/tire condition and wear", status: "unchecked" },
      { id: "tracks_2", text: "Track tension (if applicable)", status: "unchecked" },
      { id: "tracks_3", text: "Sprockets and idlers", status: "unchecked" },
      { id: "tracks_4", text: "Undercarriage frame condition", status: "unchecked" },
    ]
  }
];

const craneChecklist: ChecklistCategory[] = [
  {
    title: "Pre-Operation Inspection",
    items: [
      { id: "crane_1", text: "Crane certification and inspection records", status: "unchecked" },
      { id: "crane_2", text: "Load charts present and legible", status: "unchecked" },
      { id: "crane_3", text: "Operator manual present", status: "unchecked" },
      { id: "crane_4", text: "Crane capacity placards visible", status: "unchecked" },
    ]
  },
  {
    title: "Boom and Rigging",
    items: [
      { id: "boom_1", text: "Boom structure and pins", status: "unchecked" },
      { id: "boom_2", text: "Boom extension mechanism", status: "unchecked" },
      { id: "boom_3", text: "Wire rope condition", status: "unchecked" },
      { id: "boom_4", text: "Hook and block condition", status: "unchecked" },
      { id: "boom_5", text: "Load block operation", status: "unchecked" },
    ]
  },
  {
    title: "Crane Controls",
    items: [
      { id: "controls_1", text: "Boom raise/lower controls", status: "unchecked" },
      { id: "controls_2", text: "Swing mechanism and controls", status: "unchecked" },
      { id: "controls_3", text: "Winch operation and controls", status: "unchecked" },
      { id: "controls_4", text: "Outrigger controls and operation", status: "unchecked" },
      { id: "controls_5", text: "Load moment indicator (LMI)", status: "unchecked" },
    ]
  },
  {
    title: "Safety Devices",
    items: [
      { id: "crane_safety_1", text: "Anti-two block system", status: "unchecked" },
      { id: "crane_safety_2", text: "Load block warning device", status: "unchecked" },
      { id: "crane_safety_3", text: "Swing lock mechanism", status: "unchecked" },
      { id: "crane_safety_4", text: "Outrigger float alarm", status: "unchecked" },
      { id: "crane_safety_5", text: "Rated capacity indicator", status: "unchecked" },
    ]
  }
];

const CheckboxButton: React.FC<{
  status: CheckStatus;
  onStatusChange: (status: CheckStatus) => void;
}> = ({ status, onStatusChange }) => {
  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-muted hover:bg-muted/80';
    }
  };

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'passed':
        return <Check className="h-4 w-4" />;
      case 'failed':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const nextStatus = status === 'unchecked' ? 'passed' : status === 'passed' ? 'failed' : 'unchecked';

  return (
    <Button
      variant="outline"
      size="sm"
      className={`w-20 ${getStatusColor(status)}`}
      onClick={() => onStatusChange(nextStatus)}
    >
      {getStatusIcon(status)}
      <span className="ml-1 text-xs">
        {status === 'unchecked' ? 'Check' : status === 'passed' ? 'Pass' : 'Fail'}
      </span>
    </Button>
  );
};

const EquipmentChecklist: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedChecklists, setSubmittedChecklists] = useState<SubmittedChecklist[]>([]);

  // Equipment details
  const [operatorName, setOperatorName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [equipmentNumber, setEquipmentNumber] = useState('');

  // Checklist states
  const [generalChecklist, setGeneralChecklist] = useState<ChecklistCategory[]>(generalEquipmentChecklist);
  const [craneChecklistState, setCraneChecklistState] = useState<ChecklistCategory[]>(craneChecklist);

  useEffect(() => {
    if (user) {
      loadSubmittedChecklists();
    }
  }, [user]);

  const loadSubmittedChecklists = async () => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSubmittedChecklists(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading checklists",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (
    categoryIndex: number,
    itemIndex: number,
    newStatus: CheckStatus,
    checklistType: 'general' | 'crane'
  ) => {
    if (checklistType === 'general') {
      const updatedChecklist = [...generalChecklist];
      updatedChecklist[categoryIndex].items[itemIndex].status = newStatus;
      setGeneralChecklist(updatedChecklist);
    } else {
      const updatedChecklist = [...craneChecklistState];
      updatedChecklist[categoryIndex].items[itemIndex].status = newStatus;
      setCraneChecklistState(updatedChecklist);
    }
  };

  const handleImageUpload = (
    categoryIndex: number,
    itemIndex: number,
    imageUrl: string,
    checklistType: 'general' | 'crane'
  ) => {
    if (checklistType === 'general') {
      const updatedChecklist = [...generalChecklist];
      updatedChecklist[categoryIndex].items[itemIndex].imageUrl = imageUrl;
      setGeneralChecklist(updatedChecklist);
    } else {
      const updatedChecklist = [...craneChecklistState];
      updatedChecklist[categoryIndex].items[itemIndex].imageUrl = imageUrl;
      setCraneChecklistState(updatedChecklist);
    }
  };

  const calculateScore = (checklist: ChecklistCategory[]) => {
    const allItems = checklist.flatMap(category => category.items);
    const passedItems = allItems.filter(item => item.status === 'passed').length;
    const failedItems = allItems.filter(item => item.status === 'failed').length;
    const totalItems = allItems.length;
    const score = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0;

    return { score, passedItems, failedItems, totalItems };
  };

  const handleSubmit = async (checklistType: EquipmentType) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit checklists.",
        variant: "destructive",
      });
      return;
    }

    if (!operatorName || !licenseNumber || !equipmentType || !equipmentNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const currentChecklist = checklistType === 'general' ? generalChecklist : craneChecklistState;
      const { score, passedItems, failedItems, totalItems } = calculateScore(currentChecklist);

      // Insert main checklist record
      const { data: checklistData, error: checklistError } = await supabase
        .from('checklists')
        .insert({
          user_id: user.id,
          inspection_date: new Date().toISOString().split('T')[0],
          checklist_type: checklistType,
          operator_name: operatorName,
          license_number: licenseNumber,
          equipment_type: equipmentType,
          equipment_number: equipmentNumber,
          score,
          passed_items: passedItems,
          failed_items: failedItems,
          total_items: totalItems,
        })
        .select()
        .single();

      if (checklistError) throw checklistError;

      // Insert checklist items
      const itemsToInsert = currentChecklist.flatMap((category, categoryIndex) =>
        category.items.map((item) => ({
          user_id: user.id,
          checklist_id: checklistData.id,
          item_id: item.id,
          item_text: item.text,
          category_title: category.title,
          status: item.status,
          image_url: item.imageUrl || null,
        }))
      );

      const { error: itemsError } = await supabase
        .from('checklist_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Checklist submitted successfully!",
        description: `Inspection score: ${score}%`,
      });

      // Reset form
      setOperatorName('');
      setLicenseNumber('');
      setEquipmentType('');
      setEquipmentNumber('');
      
      // Reset checklists
      if (checklistType === 'general') {
        setGeneralChecklist(generalEquipmentChecklist);
      } else {
        setCraneChecklistState(craneChecklist);
      }

      // Reload submitted checklists
      loadSubmittedChecklists();
      setActiveTab("submitted");

    } catch (error: any) {
      toast({
        title: "Error submitting checklist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInspectionForm = (
    checklist: ChecklistCategory[],
    checklistType: 'general' | 'mobile_crane',
    title: string
  ) => {
    const { score, passedItems, failedItems, totalItems } = calculateScore(checklist);

    return (
      <div className="space-y-6">
        {/* Equipment Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Equipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Operator Name *</Label>
              <Input
                id="operator"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number *</Label>
              <Input
                id="license"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Enter license number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipType">Equipment Type *</Label>
              <Input
                id="equipType"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                placeholder="Enter equipment type"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipNumber">Equipment Number *</Label>
              <Input
                id="equipNumber"
                value={equipmentNumber}
                onChange={(e) => setEquipmentNumber(e.target.value)}
                placeholder="Enter equipment number"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Score Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Inspection Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{score}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{passedItems}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{failedItems}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalItems}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklist.map((category, categoryIndex) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-sm">{item.text}</span>
                      <CheckboxButton
                        status={item.status}
                        onStatusChange={(newStatus) =>
                          handleStatusChange(categoryIndex, itemIndex, newStatus, checklistType === 'mobile_crane' ? 'crane' : 'general')
                        }
                      />
                    </div>
                    <ImageUpload
                      currentImageUrl={item.imageUrl}
                      onImageUpload={(imageUrl) =>
                        handleImageUpload(categoryIndex, itemIndex, imageUrl, checklistType === 'mobile_crane' ? 'crane' : 'general')
                      }
                      itemId={item.id}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          onClick={() => handleSubmit(checklistType)}
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Report...
            </>
          ) : (
            `Submit ${title} Report`
          )}
        </Button>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the equipment checklist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Equipment Inspection Checklist</h1>
        <p className="text-muted-foreground">
          Complete daily equipment inspections and track maintenance requirements
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new">New Inspection</TabsTrigger>
          <TabsTrigger value="general">General Equipment</TabsTrigger>
          <TabsTrigger value="crane">Mobile Crane</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Start New Inspection</CardTitle>
              <CardDescription>
                Choose the type of equipment inspection you want to perform.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveTab("general")}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>General Equipment</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setActiveTab("crane")}
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>Mobile Crane</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          {renderInspectionForm(generalChecklist, 'general', 'General Equipment')}
        </TabsContent>

        <TabsContent value="crane">
          {renderInspectionForm(craneChecklistState, 'mobile_crane', 'Mobile Crane')}
        </TabsContent>

        <TabsContent value="submitted">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Submitted Checklists
              </CardTitle>
              <CardDescription>
                View your recent equipment inspection reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {submittedChecklists.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No submitted checklists found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submittedChecklists.map((checklist) => (
                      <Card key={checklist.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{checklist.operator_name}</span>
                          </div>
                          <Badge variant={checklist.score >= 80 ? "default" : "destructive"}>
                            {checklist.score}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div>Date: {new Date(checklist.inspection_date).toLocaleDateString()}</div>
                          <div>Type: {checklist.checklist_type.replace('_', ' ')}</div>
                          <div>Equipment: {checklist.equipment_number}</div>
                          <div>License: {checklist.license_number}</div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm">
                          <span>Passed: {checklist.passed_items}/{checklist.total_items}</span>
                          <span>Failed: {checklist.failed_items}/{checklist.total_items}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentChecklist;