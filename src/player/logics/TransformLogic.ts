import type {IGsLogic, IGsWidgetProps} from '../../type';
import {watch} from 'vue';
import {Timer} from "gs-base/timer";

export class TransformLogic implements IGsLogic {
	private props: IGsWidgetProps | null = null;
	private isDragging = false;
	private startPos = {x: 0, y: 0};
	private startTranslate = {x: 0, y: 0};
	private stopWatchTrans: Function;
	private stopWatchOther: Function;
	private handleClick = false;
	private timer = new Timer(100)

	mount(props: IGsWidgetProps): void {
		this.props = props;
		this.handleClick = props.cxt.handleClick;
		this.registerEvents();
		this.setupWatcher();
	}

	unmount(): void {
		this.unregisterEvents();
		this.stopWatchTrans?.();
		this.stopWatchOther?.();
		this.timer.cancel()
		this.timer = this.stopWatchTrans = this.stopWatchOther = this.props = null;
	}

	private registerEvents(): void {
		const {core} = this.props!;
		const el = core.el;

		el.addEventListener('mousedown', this.onMouseDown);
		el.addEventListener('touchstart', this.onTouchStart);
		el.addEventListener('touchmove', this.onTouchMove);
		el.addEventListener('touchend', this.onTouchEnd);
	}

	private unregisterEvents(): void {
		if (!this.props) return;
		const {core} = this.props;
		const el = core.el;

		el.removeEventListener('mousedown', this.onMouseDown);
		el.removeEventListener('touchstart', this.onTouchStart);
		el.removeEventListener('touchmove', this.onTouchMove);
		el.removeEventListener('touchend', this.onTouchEnd);
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	}

	private setupWatcher(): void {
		const {cxt, core} = this.props!;

		this.stopWatchTrans = watch(
			() => cxt.transform,
			() => this.updateTransformStyle(),
			{deep: true}
		);
		this.stopWatchOther = watch(
			() => [cxt.rootSize, core.src],
			async () => {
				await this.timer.reWait();
				this.updateTransformStyle()
			},
			{deep: true, immediate: true}
		);
	}

	private updateTransformStyle(): void {
		if (!this.props) return;
		const {core, cxt} = this.props;

		const state = cxt.transform;
		const transforms: string[] = [];
		const [containerW, containerH] = cxt.rootSize;

		transforms.push('scale(1)');
		if (state.scaleMode === 'fit') {
			const [videoWidth, videoHeight] = core.size;

			if (videoWidth > 0 && videoHeight > 0 && containerW > 0 && containerH > 0) {
				const videoRatio = videoWidth / videoHeight;
				const containerRatio = containerW / containerH;

				if (videoRatio > containerRatio) {
					core.style.width = '100%';
					core.style.height = 'auto';
				} else {
					core.style.width = 'auto';
					core.style.height = '100%';
				}
			} else {
				core.style.width = 'auto';
				core.style.height = 'auto';
			}
		} else {
			core.style.width = 'auto';
			core.style.height = 'auto';
			if (typeof state.scaleMode === 'number') {
				transforms.push(`scale(${state.scaleMode})`);
			} else {
				transforms.push('scale(1)');
			}
		}

		if (state.flipHorizontal) {
			transforms.push('scaleX(-1)');
		}

		if (state.flipVertical) {
			transforms.push('scaleY(-1)');
		}

		if (state.rotation !== 0) {
			transforms.push(`rotate(${state.rotation}deg)`);
		}

		if (state.translateX !== 0 || state.translateY !== 0) {
			transforms.push(`translate(${state.translateX}px, ${state.translateY}px)`);
		}

		core.style.transform = transforms.join(' ');
	}

	private onMouseDown = (e: MouseEvent) => {
		this.isDragging = true;
		this.startPos = {x: e.clientX, y: e.clientY};
		const state = this.props!.cxt.transform;
		this.startTranslate = {x: state.translateX, y: state.translateY};

		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
		e.preventDefault();
	};

	private onMouseMove = (e: MouseEvent) => {
		if (!this.isDragging || !this.props) return;
		this.props.cxt.handleClick = false;

		const dx = e.clientX - this.startPos.x;
		const dy = e.clientY - this.startPos.y;

		const state = this.props.cxt.transform;
		state.translateX = this.startTranslate.x + dx;
		state.translateY = this.startTranslate.y + dy;
	};

	private onMouseUp = () => {
		this.isDragging = false;
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
		setTimeout(() => this.props.cxt.handleClick = this.props.props.handleClick, 310);
	};

	private onTouchStart = (e: TouchEvent) => {
		if (e.touches.length === 0) return;
		this.props.cxt.handleClick = false;
		this.isDragging = true;
		const touch = e.touches[0];
		this.startPos = {x: touch.clientX, y: touch.clientY};
		const state = this.props!.cxt.transform;
		this.startTranslate = {x: state.translateX, y: state.translateY};
		e.preventDefault();
	};

	private onTouchMove = (e: TouchEvent) => {
		if (!this.isDragging || !this.props || e.touches.length === 0) return;
		this.props.cxt.handleClick = false;

		const touch = e.touches[0];
		const dx = touch.clientX - this.startPos.x;
		const dy = touch.clientY - this.startPos.y;

		const state = this.props.cxt.transform;
		state.translateX = this.startTranslate.x + dx;
		state.translateY = this.startTranslate.y + dy;
		e.preventDefault();
	};

	private onTouchEnd = () => {
		this.isDragging = false;
		setTimeout(() => this.props.cxt.handleClick = this.props.props.handleClick, 310);
	};
}
