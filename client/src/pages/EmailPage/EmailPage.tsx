import { EmailView, Header, Sidebar } from "@features";

export function EmailPage() {
  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        <EmailView />
      </main>
    </>
  );
}
