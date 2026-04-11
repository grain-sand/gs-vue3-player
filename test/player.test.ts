// noinspection TypeScriptUnresolvedReference,TypeScriptValidateTypes

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Player from '../src/core/Player.vue';
import Hls from 'hls.js';

// 模拟 Hls 类
vi.mock('hls.js', () => {
  const MockHls = vi.fn().mockImplementation(() => ({
    loadSource: vi.fn(),
    attachMedia: vi.fn(),
    destroy: vi.fn(),
  }));
  MockHls.isSupported = vi.fn().mockReturnValue(true);
  return {
    default: MockHls,
  };
});

// 模拟 HTMLVideoElement
const canPlayTypeSpy = vi.spyOn(HTMLVideoElement.prototype, 'canPlayType');
canPlayTypeSpy.mockReturnValue('probably'); // 默认返回支持，用于非 HLS 测试

describe('Player.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render video element with correct src for MP4', async () => {
    const testSrc = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';

    const wrapper = mount(Player, {
      props: {
        src: testSrc,
        controls: true,
      },
    });

    const videoElement = wrapper.find('video').element as HTMLVideoElement;
    expect(videoElement.src).toContain(testSrc);
    expect(videoElement.controls).toBe(true);
  });

  it('should use HLS for m3u8 sources', async () => {
    const testSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

    // 让 canPlayType 返回空字符串，模拟浏览器不支持原生 HLS
    canPlayTypeSpy.mockReturnValue('');
	  mount(Player, {
		  props: {
			  src: testSrc,
		  },
	  });
	  expect(Hls).toHaveBeenCalled();
  });

  it('should update src when prop changes', async () => {
    const initialSrc = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';
    const updatedSrc = 'https://test-videos.co.uk/vids/others/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_2MB.mp4';

    const wrapper = mount(Player, {
      props: {
        src: initialSrc,
      },
    });

    await wrapper.setProps({ src: updatedSrc });

    const videoElement = wrapper.find('video').element as HTMLVideoElement;
    expect(videoElement.src).toContain(updatedSrc);
  });

  it('should handle HLS config correctly', async () => {
    const testSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    const customHlsConfig = {
      maxBufferLength: 60,
      startLevel: 0,
    };

    // 让 canPlayType 返回空字符串，模拟浏览器不支持原生 HLS
    canPlayTypeSpy.mockReturnValue('');
	  mount(Player, {
		  props: {
			  src: testSrc,
			  hlsConfig: customHlsConfig,
		  },
	  });
	  expect(Hls).toHaveBeenCalledWith(expect.objectContaining(customHlsConfig));
  });

  it('should pass through native video attributes', async () => {
    const testSrc = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';

    const wrapper = mount(Player, {
      props: {
        src: testSrc,
        controls: true,
        autoplay: true,
        muted: true,
        loop: true,
      },
    });

    const videoElement = wrapper.find('video').element as HTMLVideoElement;
    expect(videoElement.controls).toBe(true);
    expect(videoElement.autoplay).toBe(true);
    expect(videoElement.muted).toBe(true);
    expect(videoElement.loop).toBe(true);
  });
});
