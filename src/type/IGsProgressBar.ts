export interface IGsProgressBarProps {
  time: number;
  duration: number;
  buffered?: number[][];
}

export interface IGsProgressBarEmits {
  seek(time: number): void;
}
