type Items = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  favorite: boolean;
  read: boolean;
  message: string;
};

export type InboxCategory = {
  items: Items[];
  totalCount: number;
};

export type OutboxCategory = {
  items: Items[];
  totalCount: number;
};

export type Mailbox = {
  inbox: InboxCategory;
  outbox: OutboxCategory;
  drafts: any[];
  trash: any[];
  pageSize: number;
};
