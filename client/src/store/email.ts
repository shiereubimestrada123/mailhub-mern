import { create } from "zustand";

// type Inbox = {
//   items: {
//     _id: string;
//     from: string;
//     to: string;
//     subject: string;
//     createdAt: Date;
//     updatedAt: Date;
//     favorite: boolean;
//     read: boolean;
//     message: string;
//   }[];
//   totalCount: number;
// };
type Mailbox<T> = {
  inbox: T[];
  outbox: T[];
  drafts: T[];
  trash: T[];
  pageSize: number;
};
type EmailState = {
  mailbox: Mailbox<any>;
  setMailbox: (mailbox: any) => void;
  getMailBox: (mailbox: any) => void;

  selectedItem: string;
  isOpen: boolean;
  setSelectedItem: (label: string) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const useEmailStore = create<EmailState>((set) => ({
  mailbox: {
    inbox: [],
    outbox: [],
    drafts: [],
    trash: [],
    pageSize: 0,
  },
  selectedItem: "inbox",
  isOpen: false,

  setMailbox: (newMailbox) => {
    console.log("newMailbox", newMailbox);
    // set((state) => {
    //   const updatedMailbox = {
    //     ...state.mailbox,
    //     // ...newMailbox.emails,
    //     ...newMailbox,
    //   };

    //   return { mailbox: updatedMailbox };
    // }),
  },

  getMailBox: (newMailbox) =>
    set((state) => {
      const updatedMailbox = {
        ...state.mailbox,
        ...newMailbox.emails,
      };

      return { mailbox: updatedMailbox };
    }),

  setSelectedItem: (label: string) => set({ selectedItem: label }),

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
