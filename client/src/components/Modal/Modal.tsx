import { IoIosClose } from "react-icons/io";
import { useEmail } from "@contexts";

export function Modal({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useEmail();

  return (
    <div className="fixed bottom-0 right-0 md:mb-[-16px] md:mr-[-16px] sm:mb-[-16px] sm:mr-[-16px] mr-[-16px] mb-[-16px] flex flex-col items-end">
      <div className="modal-box md:w-[600px] md:h-[500px] w-[400px] p-0 rounded-none">
        <div className="flex justify-between bg-slate-200 p-2">
          <h3 className="font-bold text-lg">New Message</h3>
          <IoIosClose className="text-3xl " onClick={() => setIsOpen(false)} />
        </div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
