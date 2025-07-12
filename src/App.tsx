import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClientDashboard from "./pages/ClientDashboard";
import CrafterDashboard from "./pages/CrafterDashboard";
import Inquiries from "./pages/Inquiries";
import InquiryDetail from "./pages/InquiryDetail";
import CreateInquiry from "./pages/CreateInquiry";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import CreateOrder from "./pages/CreateOrder";
import Chat from "./pages/Chat";
import RateOrder from "./pages/RateOrder";
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BottomNavigation from "./components/BottomNavigation";
import { InquiryProvider } from "./contexts/InquiryContext";
import { OrderProvider } from "./contexts/OrderContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InquiryProvider>
        <OrderProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/crafter-dashboard" element={<CrafterDashboard />} />
                <Route path="/inquiries" element={<Inquiries />} />
                <Route path="/inquiry/:id" element={<InquiryDetail />} />
                <Route path="/create" element={<CreateInquiry />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/create-order" element={<CreateOrder />} />
                <Route path="/chat/:orderId" element={<Chat />} />
                <Route path="/rate-order/:orderId" element={<RateOrder />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavigation />
            </div>
          </BrowserRouter>
        </OrderProvider>
      </InquiryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
