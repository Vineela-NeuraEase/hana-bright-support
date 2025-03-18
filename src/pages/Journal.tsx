
import { useState } from "react";
import { useJournalEntries } from "@/hooks/useJournal";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { JournalTabs } from "@/components/journal/JournalTabs";
import { JournalCarousel } from "@/components/journal/JournalCarousel";
import { SentimentSummary } from "@/components/journal/SentimentSummary";

const Journal = () => {
  const { session } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const { data: entries = [], isLoading, error } = useJournalEntries();
  const [activeTab, setActiveTab] = useState("0");
  const isMobile = useIsMobile();

  // Redirect if not logged in
  if (!session) {
    return <Navigate to="/auth" />;
  }

  // Handle tab change from tab clicks
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Define tab labels based on device type (mobile or web)
  const tabLabels = isMobile 
    ? [
        "How You're Feeling",
        "Mood Factors",
        "Mood Trends",
        "Journal Entries"
      ]
    : [
        "How You're Feeling",
        "Mood Factors",
        "Mood Trends",
        "Journal Entries"
      ];

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <JournalHeader 
        showForm={showForm} 
        setShowForm={setShowForm} 
        isMobile={isMobile} 
      />

      <SentimentSummary entries={entries} />

      <div className="relative">
        <JournalTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tabLabels={tabLabels}
        />

        <JournalCarousel 
          showForm={showForm}
          entries={entries}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default Journal;
