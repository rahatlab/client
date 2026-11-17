export interface EventItem {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  creatorEmail: string;
  creatorName: string;
  createdAt: string;
  participants?: number;
}

export interface SessionUser {
  name: string;
  email: string;
  image: string | null;
}

export interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: SessionUser | null;
  token: string | null;
}

export const EVENT_TYPE_OPTIONS = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Clothes Distribution",
  "Blood Donation",
  "Education",
  "Community Service",
  "Other",
] as const;
