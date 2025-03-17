// const lunisolar = require('lunisolar');
import lunisolar from 'lunisolar'

// 天干和地支对应的五行
const heavenlyStemsToWuXing = {
  '甲': '木',
  '乙': '木',
  '丙': '火',
  '丁': '火',
  '戊': '土',
  '己': '土',
  '庚': '金',
  '辛': '金',
  '壬': '水',
  '癸': '水'
};

const earthlyBranchesToWuXing = {
  '子': '水',
  '亥': '水',
  '寅': '木',
  '卯': '木',
  '巳': '火',
  '午': '火',
  '申': '金',
  '酉': '金',
  '辰': '土',
  '戌': '土',
  '丑': '土',
  '未': '土'
};

// 获取四柱的五行分布
function getWuXingDistribution(pillar) {
  const wuXingCount = {
    木: 0,
    火: 0,
    土: 0,
    金: 0,
    水: 0
  };

  // 遍历四柱
  Object.values(pillar).forEach(item => {
    const stem = item.stem.name; // 天干
    const branch = item.branch.name; // 地支

    // 统计天干的五行
    if (heavenlyStemsToWuXing[stem]) {
      wuXingCount[heavenlyStemsToWuXing[stem]]++;
    }

    // 统计地支的五行
    if (earthlyBranchesToWuXing[branch]) {
      wuXingCount[earthlyBranchesToWuXing[branch]]++;
    }
  });

  return wuXingCount;
}

// 判断五行缺失
function getMissingWuXing(wuXingCount) {
  const missingWuXing = [];
  const allWuXing = ['木', '火', '土', '金', '水'];

  allWuXing.forEach(wx => {
    if (wuXingCount[wx] === 0) {
      missingWuXing.push(wx);
    }
  });

  return missingWuXing;
}

// 主函数
export function analyzeWuXing(dateTime) {
  // 使用 lunisolar 获取四柱
  const lsr = lunisolar(dateTime);
  const pillar = lsr.char8; // 获取八字

  // 提取四柱数据
  const pillars = {
    year: pillar.year, // 年柱
    month: pillar.month, // 月柱
    day: pillar.day, // 日柱
    hour: pillar.hour // 时柱
  };

  // 获取五行分布
  const wuXingCount = getWuXingDistribution(pillars);

  // 判断缺失的五行
  const missingWuXing = getMissingWuXing(wuXingCount);

  return {
    pillars: [
      pillars.year.name,
      pillars.month.name,
      pillars.day.name,
      pillars.hour.name,
    ],
    wuXingDistribution: wuXingCount,
    missingWuXing: missingWuXing
  };
}