import { EmailView, Header, Sidebar } from "@features";
import { CategoryItem } from "@features";
import { useParams } from "react-router-dom";

export function EmailPage() {
  const { category, categoryId } = useParams();

  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        {categoryId ? (
          <CategoryItem categoryId={categoryId} category={category} />
        ) : (
          <EmailView />
        )}
      </main>
    </>
  );
}
