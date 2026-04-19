import {AspectRatio, GsPlayerSource, IAuthor, ISourceWrapper, PlayerSourceType} from "../../type";

export class SourceWrapper implements ISourceWrapper {

	constructor(
		public readonly _raw: GsPlayerSource & any,
		public readonly _id: number
	) {
	}

	private _type?: string

	get type(): PlayerSourceType {
		return this._type || this._raw.type
	}

	set type(v: PlayerSourceType) {
		this._raw.type = this._type = v;
	}

	get poster(): string {
		return this._raw.poster
	}

	get src(): any {
		if (typeof this._raw === 'string') {
			return this._raw
		}
		return this._raw.src || this._raw;
	}

	get title(): string {
		return this._raw.title;
	}

	get link() {
		return this._raw.link
	}

	get data(): any {
		return this._raw.data
	}

	get duration(): number {
		return this._raw.duration || 0
	}

	set duration(v: number) {
		this._raw.duration = v
	}


	get author(): IAuthor {
		return this._raw.author;
	}

	get index(): number {
		return this._raw.index;
	}

	get aspectRatio(): AspectRatio {
		return this._raw.aspectRatio;
	}
}
