import { IoIosClose } from "react-icons/io";
import { useEmail } from "@contexts";

export function Modal({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useEmail();

  return (
    <div className="fixed bottom-0 right-0 mb-[-16px] mr-[-16px] flex flex-col items-end sm:mb-[-16px] sm:mr-[-16px] md:mb-[-16px] md:mr-[-16px]">
      <div className="modal-box w-[400px] rounded-none p-0 md:h-[500px] md:w-[600px]">
        <div className="flex justify-between bg-slate-200 p-2">
          <h3 className="text-lg font-bold">New Message</h3>
          <IoIosClose className="text-3xl " onClick={() => setIsOpen(false)} />
        </div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
