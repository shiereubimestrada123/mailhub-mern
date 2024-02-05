import { IoIosClose } from "react-icons/io";

type ModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

export function Modal({ setIsOpen, children }: ModalProps) {
  return (
    <div className="fixed bottom-0 right-0 mb-8 mr-8 flex flex-col items-end ">
      <div className="modal-box w-[600px] h-[500px] p-0 rounded-none">
        <div className="flex justify-between bg-slate-200 p-2">
          <h3 className="font-bold text-lg">New Message</h3>
          <IoIosClose className="text-3xl " onClick={() => setIsOpen(false)} />
        </div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
