export interface EventInfoI {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  sessions: EventSessionI[];
}

export interface EventSessionI {
  date: string;
  availability: number;
  selected?: number;
}
