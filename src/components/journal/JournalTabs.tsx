
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";

interface JournalTabsProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  tabLabels: string[];
}

export const JournalTabs = ({ 
  activeTab, 
  handleTabChange, 
  tabLabels 
}: JournalTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-4">
      <TabsList className="w-full grid grid-cols-4">
        {tabLabels.map((label, index) => (
          <TabsTrigger key={index} value={index.toString()}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
