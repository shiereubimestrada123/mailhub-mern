import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { EmailPage, AccountPage, NotFoundPage } from "@pages";
import { CategoryItem } from "@features";
import App from "./App.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/account" element={<AccountPage />} />
      <Route path="/email/:category/*" element={<EmailPage />}>
        <Route path=":categoryId" element={<CategoryItem />} />
      </Route>
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Route>,
  ),
);
