import EquipmentChecklist from "@/components/equipment-checklist";
import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EquipmentChecklist />
    </div>
  );
};

export default Index;
