
import { useState, useEffect } from "react";
import { useJournalEntries } from "@/hooks/useJournal";
import { JournalEntriesList } from "@/components/journal/JournalEntriesList";
import { MoodTrendChart } from "@/components/journal/MoodTrendChart";
import { Button } from "@/components/ui/button";
import { PlusCircle, X, CircleIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoodFactors } from "@/components/journal/MoodFactors";

const Journal = () => {
  const { session } = useAuth();
  const [showForm, setShowForm] = useState(true);
  const { data: entries = [], isLoading, error } = useJournalEntries();
  const [activeTab, setActiveTab] = useState("0");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Redirect if not logged in
  if (!session) {
    return <Navigate to="/auth" />;
  }

  // Handle tab change from tab clicks
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Synchronize the carousel with the tab selection
    if (carouselApi) {
      carouselApi.scrollTo(parseInt(value));
    }
  };

  // Handle carousel change event
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveTab(String(carouselApi.selectedScrollSnap()));
    };

    carouselApi.on("select", onSelect);
    
    // Cleanup
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const renderCarouselDots = () => {
    if (!carouselApi) return null;
    
    const slides = [0, 1, 2]; // Three slides now (removed "How You're Feeling")
    return (
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`rounded-full p-0 h-3 w-3 ${activeTab === index.toString() ? 'bg-primary' : 'bg-muted'}`}
            onClick={() => {
              if (carouselApi) carouselApi.scrollTo(index);
            }}
          >
            <CircleIcon className="h-3 w-3" />
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Journal</h1>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              <X className="mr-2 h-4 w-4" />
              Close Form
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Track your moods and journal your thoughts to gain insight into your emotional patterns.
        </p>
      </div>

      <div className="relative">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="0">Mood Factors</TabsTrigger>
            <TabsTrigger value="1">Mood Trends</TabsTrigger>
            <TabsTrigger value="2">Journal Entries</TabsTrigger>
          </TabsList>
        </Tabs>

        <Carousel 
          className="w-full"
          opts={{ 
            align: "start",
            loop: false,
          }}
          setApi={setCarouselApi}
          orientation="horizontal"
        >
          <CarouselContent>
            {/* Page 1: Mood Factors */}
            <CarouselItem className="basis-full">
              {showForm ? (
                <Card>
                  <CardContent className="p-4">
                    <MoodFactors />
                  </CardContent>
                </Card>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p>Click "New Entry" to add mood factors</p>
                </div>
              )}
            </CarouselItem>

            {/* Page 2: Mood Trends Chart */}
            <CarouselItem className="basis-full">
              <Card className="border-0 shadow-none">
                <CardContent className="p-1">
                  <MoodTrendChart entries={entries} />
                </CardContent>
              </Card>
            </CarouselItem>

            {/* Page 3: Journal Entries List */}
            <CarouselItem className="basis-full">
              <Card className="border-0 shadow-none">
                <CardContent className="p-1">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading journal entries...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-4 text-destructive">
                      Error loading journal entries
                    </div>
                  ) : (
                    <JournalEntriesList entries={entries} />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          
          {/* Dots pagination instead of arrows */}
          {renderCarouselDots()}
        </Carousel>
      </div>
    </div>
  );
};

export default Journal;
