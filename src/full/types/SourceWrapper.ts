import {ITypedPlayerSource, PlayerSource, PlayerSourceType} from "../../types";

export class SourceWrapper implements ITypedPlayerSource {

	constructor(
		public readonly data: PlayerSource&ITypedPlayerSource,
		public readonly index:number
	) {
	}

	get poster(): string {
		return this.data.poster
	}

	get src(): any {
		return this.data.src;
	}

	get title(): string {
		return this.data.src;
	}

	get type(): PlayerSourceType {
		return this.data.type
	}

	set type(v: PlayerSourceType) {
		this.data.type = v;
	}

}
