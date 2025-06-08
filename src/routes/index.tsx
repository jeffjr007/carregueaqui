import { Route } from "react-router-dom";
import Terms from "@/pages/Terms";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import AboutApp from "@/pages/AboutApp";

<>
  <Route path="/termos" element={<Terms />} />
  <Route path="/privacidade" element={<PrivacyPolicy />} />
  <Route path="/sobre" element={<AboutApp />} />
</> 