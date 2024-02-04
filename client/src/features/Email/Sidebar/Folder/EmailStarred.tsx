import { useParams } from "react-router-dom";

export const EmailStarred = () => {
  const { starred } = useParams();
  console.log("starred", starred);

  return <div>EmailStarred</div>;
};
