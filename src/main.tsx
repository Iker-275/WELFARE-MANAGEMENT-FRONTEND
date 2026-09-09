import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppWrapper } from './components/common/PageMeta.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { AnnouncementProvider } from "./context/AnnouncementContext.tsx";
import { RoleProvider } from "./context/RoleContext.tsx";
import { PermissionProvider } from "./context/PermissionContext.tsx";
import { RegionProvider } from "./context/RegionContext.tsx";
import { GenderProvider } from "./context/GenderContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import ImportTypeProvider from "./context/ImportTypeContext.tsx";
import ImportProvider from "./context/ImportContext.tsx";
import NextOfKinProvider from "./context/NextOfKinContext.tsx";
import DependantProvider from "./context/DependantContext.tsx";
import { EmploymentProvider } from "./context/EmploymentContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { DashboardProvider } from "./context/DashboardContext.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <PermissionProvider>
            <RegionProvider>
              <UserProvider>
                <AppWrapper>
                  <NotificationProvider>
                  <GenderProvider>
                    <NextOfKinProvider>
                      <DependantProvider>
                        <EmploymentProvider>
                          <ImportTypeProvider>
                            <ImportProvider>
                              <AnnouncementProvider>
                                <DashboardProvider>



                                <App />


                                </DashboardProvider>
                              </AnnouncementProvider>
                            </ImportProvider>

                          </ImportTypeProvider>
                        </EmploymentProvider>
                      </DependantProvider>
                    </NextOfKinProvider>
                  </GenderProvider>
                  </NotificationProvider>
                </AppWrapper>
              </UserProvider>
            </RegionProvider>
          </PermissionProvider>
        </RoleProvider>

      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);


