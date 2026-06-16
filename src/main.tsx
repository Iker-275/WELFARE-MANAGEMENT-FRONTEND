import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppWrapper } from './components/common/PageMeta.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { DashboardProvider } from "./context/DashboardContext.tsx";
import { AnnouncementProvider } from "./context/AnnouncementContext.tsx";
import { RoleProvider } from "./context/RoleContext.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppWrapper>
          <NotificationProvider>
            <AnnouncementProvider>
            <DashboardProvider>
<RoleProvider>
             
                
                  
                        <App />
                      
</RoleProvider>
              
            </DashboardProvider>
            </AnnouncementProvider>
          </NotificationProvider>
        </AppWrapper>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);


