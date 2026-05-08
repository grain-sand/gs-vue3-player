import {PlaySource, ISourceWrapper, PlaySourceType, IAuthor, AspectRatio} from "../type";

export class SourceWrapper implements ISourceWrapper {

	constructor(
		public readonly _raw: PlaySource & any,
		public readonly _id: number
	) {
	}

	private _type?: PlaySourceType

	get type(): PlaySourceType {
		return this._type || this._raw.type || 'mp4'
	}

	set type(v: PlaySourceType) {
		this._raw.type = this._type = v;
	}

	private _aspectRatio?: AspectRatio | undefined

	get aspectRatio(): AspectRatio | undefined {
		return this._aspectRatio || this._raw.aspectRatio;
	}

	set aspectRatio(v: AspectRatio | undefined) {
		if (typeof this._raw === 'object') {
			this._raw.aspectRatio = v
		}
		this._aspectRatio = v;
	}

	private _duration?: number

	get duration(): number {
		return this._duration || this._raw.duration || 0
	}

	set duration(v: number) {
		if (typeof this._raw === 'object') {
			this._raw.duration = v
		}
		this._duration = v
	}

	get poster(): string {
		return this._raw.poster || ''
	}

	get src(): any {
		if (typeof this._raw === 'string') {
			return this._raw
		}
		return this._raw.src || this._raw;
	}

	get title(): string {
		return this._raw.title || '';
	}

	get link() {
		return this._raw.link
	}

	get data(): any {
		return this._raw.data
	}

	get author(): IAuthor | undefined {
		return this._raw.author;
	}

	get index(): number {
		return this._raw.index || 0;
	}

	get description(): string {
		return this._raw.description || '';
	}

	get downloadUrl(): string | undefined {
		return this._raw.downloadUrl;
	}

	private _createdAt?: Date

	get createdAt(): Date | undefined {
		if (!this._raw.createdAt) {
			return undefined;
		}
		return this._createdAt || (this._createdAt = new Date(this._raw.createdAt));
	}
}
