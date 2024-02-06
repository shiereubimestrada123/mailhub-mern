import { EmailView, Header, Sidebar } from "@features";
import { EmailProvider } from "@contexts";
import { useMediaQuery } from "@hooks";

export function EmailPage() {
  // const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  // const isMediumScreen = useMediaQuery(
  //   "(min-width: 768px) and (max-width: 1023px)"
  // );
  // const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <EmailProvider>
      <Header />
      <main className="">
        <Sidebar />
        <EmailView />
      </main>
    </EmailProvider>
  );
}
