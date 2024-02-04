import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { EmailPage, AccountPage, NotFoundPage } from "@pages";
import { EmailInbox, EmailStarred } from "@features";
import App from "./App.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/account" element={<AccountPage />} />
      <Route path="/email" element={<EmailPage />}>
        <Route path=":inbox" element={<EmailInbox />} />
        <Route path=":starred" element={<EmailStarred />} />
      </Route>
      {/* <Route path="/email/*" element={<EmailPage />} /> */}
      {/* <Route path="/not-found" element={<NotFoundPage />} /> */}
      {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
    </Route>
  )
);
