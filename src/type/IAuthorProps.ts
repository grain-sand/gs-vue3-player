import {AuthorType} from "./UnionTypes";

export interface IAuthor {
	profileImage?: string;
	name: string;
	link?: string;

	/**
	 * 用于显示作者类型图标
	 * - `AuthorType`  使用内置图标
	 * - 其它`string`当作 图标URL字符串处理
	 * */
	type?: AuthorType | string;
}

export interface IAuthorProps {

	author?: IAuthor;

	handleClick?: boolean;

	linkHandler?: (url: string) => undefined | void | Promise<void>;
}
