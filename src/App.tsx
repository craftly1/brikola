
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inquiries from "./pages/Inquiries";
import InquiryDetail from "./pages/InquiryDetail";
import CreateInquiry from "./pages/CreateInquiry";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import { InquiryProvider } from "./contexts/InquiryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InquiryProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 pb-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inquiries" element={<Inquiries />} />
              <Route path="/inquiry/:id" element={<InquiryDetail />} />
              <Route path="/create" element={<CreateInquiry />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </InquiryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
