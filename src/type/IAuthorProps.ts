
export interface IAuthor {
	profileImage?: string;
	name: string;
	link?: string;
}

export interface IAuthorProps {

	author?: IAuthor

	handleClick?: boolean;

}
