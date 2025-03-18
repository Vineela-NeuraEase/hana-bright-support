
import { useState, useEffect } from "react";
import { JournalEntry } from "@/types/journal";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CircleIcon } from "lucide-react";
import { MoodInput } from "./MoodInput";
import { MoodFactors } from "./MoodFactors";
import { MoodTrendChart } from "./MoodTrendChart";
import { JournalEntriesList } from "./JournalEntriesList";

interface JournalCarouselProps {
  showForm: boolean;
  entries: JournalEntry[];
  isLoading: boolean;
  error: unknown;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
}

export const JournalCarousel = ({
  showForm,
  entries,
  isLoading,
  error,
  activeTab,
  setActiveTab,
  isMobile,
}: JournalCarouselProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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
  }, [carouselApi, setActiveTab]);

  const renderCarouselDots = () => {
    if (!carouselApi) return null;
    
    const slides = [0, 1, 2, 3]; // Four slides
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
        {/* Page 1: How You're Feeling */}
        <CarouselItem className="basis-full">
          {showForm ? (
            <Card>
              <CardContent className="p-4">
                {!isMobile && <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>}
                <MoodInput />
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p>Click "New Entry" to add a mood entry</p>
            </div>
          )}
        </CarouselItem>

        {/* Page 2: Mood Factors - Without title */}
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

        {/* Page 3: Mood Trends Chart */}
        <CarouselItem className="basis-full">
          <Card className="border-0 shadow-none">
            <CardContent className="p-1">
              <MoodTrendChart entries={entries} />
            </CardContent>
          </Card>
        </CarouselItem>

        {/* Page 4: Journal Entries List - Already has its own title */}
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
  );
};
