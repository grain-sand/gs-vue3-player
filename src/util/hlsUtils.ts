import Hls from 'hls.js';

/**
 * HLS质量切换规则
 */
export function switchHlsQuality(
  hls: Hls | null,
  targetLevel: number,
  now: boolean = false
): void {
  if (!hls) return;

  // 如果与当前质量相同则跳过切换
  if (hls.currentLevel === targetLevel) return;

  if (now) {
    // 立即切换到目标质量
    hls.currentLevel = targetLevel;
  } else {
    // 默认切换到下一个质量
    hls.nextLevel = targetLevel;
  }

}

/**
 * 从HLS质量级别中获取最接近参考尺寸的级别
 */
export function findClosestHlsLevel(
  hls: Hls | null,
  reference: number,
  dimension: 'width' | 'height'
): number {
  if (!hls || !hls.levels || hls.levels.length === 0) return -1;

  let closestLevel = 0;
  let minDifference = Number.MAX_VALUE;

  hls.levels.forEach((level, index) => {
    const candidate = dimension === 'width' ? level.width : level.height;
    if (candidate) {
      const difference = Math.abs(candidate - reference);
      if (difference < minDifference) {
        minDifference = difference;
        closestLevel = index;
      } else if (difference === minDifference) {
        // 如果差异相同，HLS优先选择较小的质量
        const currentCandidate = dimension === 'width' ? hls.levels[closestLevel].width : hls.levels[closestLevel].height;
        if (currentCandidate && candidate < currentCandidate) {
          closestLevel = index;
        }
      }
    }
  });

  return closestLevel;
}
