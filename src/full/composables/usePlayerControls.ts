import {watch} from 'vue';
import type {IGsPlayerProps, IPlayerExpose, PlaybackMode, PlayerSource} from '../../types';

interface UsePlayerControlsOptions {
	playerRef: { value: IPlayerExpose };
	playerContainerRef?: { value: HTMLElement | undefined };
	props: IGsPlayerProps;
	currentPlaybackMode: { value: PlaybackMode };
	currentIndex: { value: number };
	isPlaying: { value: boolean };
	playbackRate: { value: number };
	isWebFullscreen: { value: boolean };
	setCurrentTime: (time: number) => void;
	setDuration: (duration: number) => void;
	setError: (error: boolean) => void;
	setIsPlaying: (playing: boolean) => void;
}

export function usePlayerControls({
	                                  playerRef,
	                                  playerContainerRef,
	                                  props,
	                                  currentPlaybackMode,
	                                  currentIndex,
	                                  playbackRate,
	                                  isWebFullscreen,
	                                  setCurrentTime,
	                                  setDuration,
	                                  setError,
                                  }: UsePlayerControlsOptions) {
	// 播放控制
	const togglePlay = async () => {
		await playerRef.value?.togglePlay();
	};

	const playSource = async (src: PlayerSource) => {
		await playerRef.value?.play(src);
		playerRef.value.el.playbackRate = playbackRate.value;
	}

	const setSrc = (src: number | PlayerSource) => {
		if (!src && src !== 0) return;
		if (typeof src === 'number' && props.playlist?.length) {
			// 处理索引播放
			const index = Math.max(0, Math.min(src, props.playlist.length - 1));
			currentIndex.value = index;
			playerRef.value?.setSrc(props.playlist[index]);
		} else {
			if (props.playlist?.length) {
				// 处理非数字源，查找索引
				const index = props.playlist.findIndex((item: any) => item === src || item.src === src);
				if (index !== -1) {
					currentIndex.value = index;
				} else {
					// 源不存在，将当前索引-1
					currentIndex.value = Math.max(-1, currentIndex.value - 1);
				}
			}
			if (typeof src !== 'number') {
				playerRef.value?.setSrc(src);
			}
		}
	}

	const play = async (src?: number | any) => {
		if(src) {
			setSrc(src);
		}
		await playerRef.value?.play();
	};

	const pause = async () => {
		await playerRef.value?.pause();
	};
	const unmute = async () => await playerRef.value?.unmute();
	const playNext = async () => {
		if (props.nextSrc) {
			await playSource(props.nextSrc);
		} else if (props.playlist && props.playlist.length > 0) {
			switchToNextInPlaylist();
		}
	};
	const playPre = async () => {
		if (props.preSrc) {
			await playSource(props.preSrc);
		} else if (props.playlist && props.playlist.length > 0) {
			switchToPreInPlaylist();
		}
	};

	// 播放模式控制
	const setPlaybackMode = (mode: PlaybackMode) => {
		currentPlaybackMode.value = mode;
	};

	// 播放列表管理
	const switchToNextInPlaylist = () => {
		if (!props.playlist || props.playlist.length === 0) return;

		let nextIndex = currentIndex.value;
		if (currentPlaybackMode.value === 'shuffle') {
			// 随机播放，确保不重复当前索引
			do {
				nextIndex = Math.floor(Math.random() * props.playlist.length);
			} while (nextIndex === currentIndex.value && props.playlist.length > 1);
		} else {
			nextIndex = (currentIndex.value + 1) % props.playlist.length;
		}

		currentIndex.value = nextIndex;
		playSource(props.playlist[nextIndex]);
	};

	const switchToPreInPlaylist = () => {
		if (!props.playlist || props.playlist.length === 0) return;

		let preIndex = currentIndex.value;
		if (currentPlaybackMode.value === 'shuffle') {
			// 随机播放，确保不重复当前索引
			do {
				preIndex = Math.floor(Math.random() * props.playlist.length);
			} while (preIndex === currentIndex.value && props.playlist.length > 1);
		} else {
			preIndex = (currentIndex.value - 1 + props.playlist.length) % props.playlist.length;
		}

		currentIndex.value = preIndex;
		playSource(props.playlist[preIndex]);
	};

	// 处理播放结束
	const handleEnded = () => {
		switch (currentPlaybackMode.value) {
			case 'sequence':
				// 检查是否有下一个视频
				if (props.nextSrc) {
					playNext();
				} else if (props.playlist && props.playlist.length > 0) {
					// 如果是播放列表的最后一个视频，则停止播放
					if (currentIndex.value < props.playlist.length - 1) {
						switchToNextInPlaylist();
					} else {
						pause();
					}
				} else {
					// 没有下一个视频，停止播放
					pause();
				}
				break;
			case 'disabled':
				// 停止播放
				pause();
				break;
			case 'loop':
				// 重新播放当前视频
				playerRef.value?.el?.play();
				break;
			case 'loopAll':
				switchToNextInPlaylist();
				break;
			case 'shuffle':
				switchToNextInPlaylist();
				break;
		}
	};

	// 其他设置
	const setPlaybackRate = (rate: number) => {
		playbackRate.value = rate;
		if (playerRef.value?.el) playerRef.value.el.playbackRate = rate;
	};

	const setVolume = (volume: number) => {
		if (playerRef.value?.el) {
			playerRef.value.el.volume = volume;
			if(volume>0) {
				playerRef.value.el.muted = false;
			}
		}
	};

	const fullscreen = () => {
		const el = playerContainerRef?.value || document.querySelector('.gs-player');
		if (!document.fullscreenElement && el) el.requestFullscreen().catch(console.error);
		else if (document.exitFullscreen) document.exitFullscreen();
	};

	const webFullscreen = () => (isWebFullscreen.value = !isWebFullscreen.value);

	const pip = async () => {
		const video = playerRef.value?.el;
		if (!video) return;

		try {
			if (document.pictureInPictureElement) {
				await document.exitPictureInPicture();
			} else {
				await video.requestPictureInPicture();
			}
		} catch (error) {
			console.error('Error toggling Picture-in-Picture:', error);
		}
	};

	const handlePlayerClick = async () => {
		if (!props.handleClick || !playerRef.value?.el) return;
		const {el} = playerRef.value;
		if (el.muted) {
			await unmute();
			await play();
		} else {
			await togglePlay();
		}
	}
	const handlePlayerDblClick = () => {
		if (!props.handleDblClick) return;
		if (document.fullscreenElement) document.exitFullscreen();
		else if (isWebFullscreen.value) isWebFullscreen.value = false;
		else webFullscreen();
	};

	// 监听 playlist 变化
	watch(
		() => props.playlist,
		(newPlaylist) => {
			if (newPlaylist && newPlaylist.length > 0) {
				// 如果没有设置 src，则使用 playlist 中的第一个视频
				if (!props.src) {
					playSource(newPlaylist[0]);
				}
			}
		},
		{deep: true}
	);

	// 事件处理
	const handleError = () => setError(true);
	const handleTimeUpdate = (e: Event) => setCurrentTime((e.target as HTMLVideoElement).currentTime);
	const handleLoadedMetadata = (e: Event) => setDuration((e.target as HTMLVideoElement).duration);

	return {
		// Methods
		handleError,
		handleTimeUpdate,
		handleLoadedMetadata,
		handleEnded,
		togglePlay,
		play,
		pause,
		unmute,
		playNext,
		playPre,
		setPlaybackMode,
		setPlaybackRate,
		setVolume,
		fullscreen,
		webFullscreen,
		pip,
		handlePlayerClick,
		handlePlayerDblClick,
		setSrc
	};
}
