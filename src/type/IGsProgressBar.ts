export interface IGsProgressBarProps {
  time: number;
  duration: number;
  buffered?: TimeRanges;
}

export interface IGsProgressBarEmits {
  seek(time: number): void;
}
