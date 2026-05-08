import {IDateI18n} from "./II18n";

export interface IGsDateDisplayProps {
  date: Date | number | string;
  i18n: IDateI18n;
  showFullOnHover?: boolean;
}
