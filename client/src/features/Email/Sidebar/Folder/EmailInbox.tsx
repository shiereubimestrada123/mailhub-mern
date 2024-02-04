import { useParams } from "react-router-dom";

export const EmailInbox = () => {
  const { inbox } = useParams();
  console.log("inbox", inbox);

  return <div>EmailInbox</div>;
};
