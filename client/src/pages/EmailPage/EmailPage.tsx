import { EmailView, Header, Sidebar } from "@features";
import { EmailProvider } from "@contexts";

export function EmailPage() {
  return (
    <EmailProvider>
      <Header />
      <main className="flex">
        <Sidebar />
        <EmailView />
      </main>
    </EmailProvider>
  );
}
