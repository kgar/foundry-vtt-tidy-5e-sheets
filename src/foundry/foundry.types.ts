export type ContextMenuEntry = {
  name?: string;
  icon?: string;
  group?: string;
  callback?: ($entryElement: any) => void;
  condition?: ($entryElement: any) => void;
};
