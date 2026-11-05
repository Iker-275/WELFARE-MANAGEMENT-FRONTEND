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
import { MembershipMetadataProvider } from "./context/MembershipMetadataContext.tsx";
import { MemberProvider } from "./context/MemberContext.tsx";
import { ContributionPlanProvider } from "./context/ContributionPlanContext.tsx";
import { ContributionRuleProvider } from "./context/ContributionRuleContext.tsx";
import { ContributionPeriodProvider } from "./context/ContributionPeriodContext.tsx";
import { MemberContributionProvider } from "./context/MemberContributionContext.tsx";
import { PaymentProviderProvider } from "./context/PaymentProviderContext.tsx";
import { PaymentProvider } from "./context/PaymentContext.tsx";
import { PenaltyRuleProvider } from "./context/PenaltyRuleContext.tsx";
import { PenaltyProvider } from "./context/PenaltyContext.tsx";
import { PenaltyAdjustmentProvider } from "./context/PenaltyAdjustmentContext.tsx";
import { ReceiptProvider } from "./context/ReceiptContext.tsx";
import { MemberStatementProvider } from "./context/MemberStatementContext.tsx";


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
                                <MembershipMetadataProvider>
                                  <MemberProvider>
                                    <ContributionPlanProvider>
                                      <ContributionRuleProvider>
                                        <ContributionPeriodProvider>
                                          <MemberContributionProvider>
                                            <PaymentProviderProvider>
                                              <PaymentProvider>
                                                <PenaltyRuleProvider>
                                                  <PenaltyProvider>
                                                    <PenaltyAdjustmentProvider>
                                                      <ReceiptProvider>
                                                        <MemberStatementProvider>
                                                          <AnnouncementProvider>
                                                            <DashboardProvider>



                                                              <App />


                                                            </DashboardProvider>
                                                          </AnnouncementProvider>
                                                        </MemberStatementProvider>
                                                      </ReceiptProvider>
                                                    </PenaltyAdjustmentProvider>
                                                  </PenaltyProvider>
                                                </PenaltyRuleProvider>
                                              </PaymentProvider>
                                            </PaymentProviderProvider>
                                          </MemberContributionProvider>
                                        </ContributionPeriodProvider>
                                      </ContributionRuleProvider>
                                    </ContributionPlanProvider>
                                  </MemberProvider>
                                </MembershipMetadataProvider>
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


