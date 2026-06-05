import {PlaySource, ISourceWrapper, PlaySourceType, IAuthor, AspectRatio} from "../type";

export class SourceWrapper implements ISourceWrapper {

	private readonly _rawIsObj: boolean

	_preloaded?: boolean;

	constructor(
		public readonly _raw: PlaySource & any,
		public readonly _id: number
	) {
		const isObj = this._rawIsObj = typeof _raw === 'object';
		if (!isObj || !_raw) return;
		const me: any = this;
		[...Object.getOwnPropertyNames(_raw.constructor.prototype || {}), ...Object.getOwnPropertyNames(_raw)].forEach(n => {
			if (n in me || n.startsWith('_')) return
			Object.defineProperty(me, n, {
				get: () => _raw[n],
				set: (v) => _raw[n] = v,
				enumerable: true,
				configurable: false
			})
		})
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
		if (this._rawIsObj) {
			this._raw.aspectRatio = v
		}
		this._aspectRatio = v;
	}

	private _duration?: number

	get duration(): number {
		return this._duration || this._raw.duration || 0
	}

	set duration(v: number) {
		if (this._rawIsObj) {
			this._raw.duration = v
		}
		this._duration = v
	}

	get poster(): string {
		return this._raw.poster || ''
	}

	get src(): any {
		if (this._rawIsObj) {
			return this._raw.src;
		}
		return this._raw.src || this._raw;
	}

	get title(): string {
		const {_raw} = this;
		if (typeof _raw === 'string') {
			return this._description || (this._description = decodeURIComponent(_raw.replace(/^.*[/\\]/, '')))
		}
		return _raw.title || '';
	}

	get link() {
		const {_raw} = this;
		if (typeof _raw === 'string') {
			return _raw
		}
		return _raw.link
	}

	get data(): any {
		return this._raw.data
	}

	get author(): IAuthor | undefined {
		return this._raw.author;
	}

	private _description?: string

	get description(): string {
		const {_raw} = this;
		if (typeof _raw === 'string') {
			return this._description || (this._description = decodeURIComponent(_raw.replace(/^.*[/\\]/, '')))
		}
		return _raw.description || '';
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

	get thumbnail(): string | undefined {
		return this._raw.thumbnail;
	}
}
