type ErrorMsgProps = {
  id: string | undefined;
  message: string | number | boolean | undefined;
};

export function ErrorMsg({ id, message }: ErrorMsgProps) {
  return message ? (
    <p id={id} className="mt-1 text-red-500">
      {message}
    </p>
  ) : null;
}
