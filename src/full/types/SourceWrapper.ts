import {ITypedPlayerSource, PlayerSource, PlayerSourceType} from "../../types";

export class SourceWrapper implements ITypedPlayerSource {

	private _type?: string

	constructor(
		public readonly data: PlayerSource & any,
		public readonly index: number
	) {
	}

	get poster(): string {
		return this.data.poster
	}

	get src(): any {
		if (typeof this.data === 'string') {
			return this.data
		}
		return this.data.src || this.data;
	}

	get title(): string {
		return this.data.title;
	}

	get type(): PlayerSourceType {
		return this._type || this.data.type
	}

	set type(v: PlayerSourceType) {
		this.data.type = this._type = v;
	}

}
