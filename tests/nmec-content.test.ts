import { describe, expect, it } from 'vitest';
import { guideBySlug } from '../src/data/guides';

const nmec = guideBySlug.get('national-museum-egyptian-civilization')!;

describe('NMEC visitor orientation', () => {
  it('explains concrete highlights and visit priorities rather than production notes', () => {
    const text = nmec.orientation.map(({ title, body }) => `${title} ${body}`).join('\n');
    expect(nmec.orientation).toHaveLength(3);
    for (const topic of ['水钟', '假脚趾', '哈特谢普苏特', '图特摩斯三世', '主展厅', '皇家木乃伊', '时间有限']) {
      expect(text).toContain(topic);
    }
    expect(text).not.toMatch(/公开研究|不推断|不虚构|页面差异|楼层图不冒充|建模|几何/);
  });

  it('keeps map evidence separate and retains an actionable visitor caution', () => {
    expect(nmec.spatial.architectureLevels).toHaveLength(2);
    for (const level of nmec.spatial.architectureLevels!) {
      expect(level.source.id).toBe('src-nmec-plan-study');
      expect(level.source.asset).toBeTruthy();
      expect(level.limitations.length).toBeGreaterThan(0);
    }
    expect(nmec.practical).toContain('展区关系示意，实际通行以现场指引为准。');
    expect(nmec.sourceIds).toEqual(expect.arrayContaining(['src-nmec-main', 'src-nmec-mummies']));
    expect(nmec.visitChapters.map(({ accessNote }) => accessNote).join('\n')).not.toMatch(/来源支持|不贴入地图|本页不把/);
  });
});
