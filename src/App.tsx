
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationMenu from "@/components/NavigationMenu";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import TasksPage from "@/pages/TasksPage";
import TaskDetailPage from "@/pages/TaskDetailPage";
import TaskEditPage from "@/pages/TaskEditPage";
import ScheduledPage from "@/pages/ScheduledPage";
import CategoriesPage from "@/pages/CategoriesPage";
import AiAssistantPage from "@/pages/AiAssistantPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/*" element={
            <div className="flex min-h-screen">
              <NavigationMenu />
              <main className="flex-1 min-w-0">
                <Routes>
                  <Route path="dashboard" element={<HomePage />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route path="tasks/new" element={<TaskDetailPage />} />
                  <Route path="tasks/:taskId" element={<TaskDetailPage />} />
                  <Route path="tasks/:taskId/edit" element={<TaskEditPage />} />
                  <Route path="scheduled" element={<ScheduledPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="ai-assistant" element={<AiAssistantPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
