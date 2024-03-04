import { EmailView, Header, Sidebar } from "@features";
import { InboxItem } from "@features"; // Import the InboxItem component
import { useParams } from "react-router-dom"; // Import useParams hook

export function EmailPage() {
  const { inboxId } = useParams(); // Get inboxId from URL parameters

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        {inboxId ? <InboxItem /> : <EmailView />}
      </main>
    </>
  );
}
