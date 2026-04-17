import type {IVideoQualityItem} from '../types';

/**
 * 计算两个尺寸之间的差异百分比
 */
export function calculateDifferencePercentage(reference: number, candidate: number): number {
  if (reference === 0) return candidate === 0 ? 0 : 100;
  return Math.abs((candidate - reference) / reference) * 100;
}

/**
 * 找出最接近参考尺寸的质量
 */
export function findClosestQuality(
  qualities: IVideoQualityItem[],
  reference: number,
  dimension: 'width' | 'height'
): IVideoQualityItem | null {
  if (qualities.length === 0) return null;

  let closestQuality = qualities[0];
  let minDifference = calculateDifferencePercentage(reference, closestQuality[dimension]);

  for (let i = 1; i < qualities.length; i++) {
    const quality = qualities[i];
    const difference = calculateDifferencePercentage(reference, quality[dimension]);

    if (difference < minDifference) {
      minDifference = difference;
      closestQuality = quality;
    } else if (difference === minDifference) {
      // 如果差异相同，优先选择较大的尺寸
      if (quality[dimension] > closestQuality[dimension]) {
        closestQuality = quality;
      }
    }
  }

  return closestQuality;
}

/**
 * 从两个质量中选择较小的那个
 */
export function selectSmallerQuality(
  quality1: IVideoQualityItem | null,
  quality2: IVideoQualityItem | null
): IVideoQualityItem | null {
  if (!quality1) return quality2;
  if (!quality2) return quality1;

  const area1 = quality1.width * (quality1.height || quality1.width);
  const area2 = quality2.width * (quality2.height || quality2.width);

  return area1 <= area2 ? quality1 : quality2;
}

/**
 * 检查两个质量是否相同
 */
export function isSameQuality(
  quality1: IVideoQualityItem | null,
  quality2: IVideoQualityItem | null
): boolean {
  if (!quality1 || !quality2) return false;
  return quality1.url === quality2.url;
}
