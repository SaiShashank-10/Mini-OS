
import React from "react";
import { OSProvider } from "@/contexts/OSContext";
import Desktop from "@/components/Desktop";

const Index = () => {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
};

export default Index;
