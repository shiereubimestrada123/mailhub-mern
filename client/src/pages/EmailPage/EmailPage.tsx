import { EmailView, Header, Sidebar } from "@features";

export function EmailPage() {
  return (
    <div className="">
      <Header />
      <main className="flex w-full">
        <Sidebar />
        <EmailView />
      </main>
    </div>
  );
}
