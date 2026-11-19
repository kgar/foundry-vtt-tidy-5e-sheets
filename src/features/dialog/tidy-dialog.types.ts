export type DialogOption<T> = {
  value: T;
  label: string;
};

export type Resolvable = {
  resolve: (value: any) => void;
  reject: (reason?: string) => void;
};

export type ChooseFromOptionsArgs<T> = {
  title?: string;
  message?: string;
  options: DialogOption<T>[];
};
