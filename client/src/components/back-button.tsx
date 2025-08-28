import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Button variant="outline" size="icon" onClick={goBack} className="shrink-0">
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
};