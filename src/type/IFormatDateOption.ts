import {IDateI18n} from "./II18n";
import {TimeZone} from "./TimeZone";

export interface IFormatDateOption {
	/** 相对时间格式化所需的多语言配置 */
	i18n: IDateI18n;
	/**
	 * 时区
	 * - 默认值为当前系统（浏览器）时区
	 * - 可指定为预定义的 IANA 时区标识
	 */
	timeZone?: TimeZone;

	/**
	 * 相对时间格式化的阈值
	 * - 默认为当前时区今日0点
	 * - 当日期大于等于此阈值时使用相对时间格式（如"多少分钟前"）
	 * - 设为 null 时不使用相对时间格式化
	 */
	relativeTimeThreshold?: Date | null;

	/**
	 * 是否显示时间
	 * - 默认为 false
	 */
	showTime?: boolean;

	/**
	 * 今年以内的日期是否省略年份
	 * - 默认为 true
	 */
	omitYearThisYear?: boolean;

	/**
	 * 是否使用短年份格式（后2位）
	 * - 默认为 true
	 */
	shortYear?: boolean;
}
