export interface FigureItOut<T> {
  options: FigureItOutOption<T>[];
  onConfirm: (selected: T[]) => void | Promise<void>;
}

export interface FigureItOutOption<T> {
  fields: {
    text: string;
    onClick?: (target: T) => void;
  }[];
  id: string;
  target: T;
  selected: boolean;
}
