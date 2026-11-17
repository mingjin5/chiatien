import { describe, it, expect } from "vitest";
import { splitByWeight, splitEqual, splitExact } from "./split";

const sum = (items: { amount: number }[]) =>
  items.reduce((s, i) => s + i.amount, 0);

describe("splitEqual", () => {
  it("chia 100.000đ cho 3 người: phần dư 1 đồng thuộc người đầu", () => {
    const result = splitEqual(100000, ["a", "b", "c"]);
    expect(result.map((r) => r.amount)).toEqual([33334, 33333, 33333]);
  });

  it("chia hết thì mọi người bằng nhau", () => {
    const result = splitEqual(90000, ["a", "b", "c"]);
    expect(result.map((r) => r.amount)).toEqual([30000, 30000, 30000]);
  });

  it("tổng luôn đúng bằng số tiền gốc", () => {
    for (const total of [1, 2, 7, 100, 99999, 100000, 1234567]) {
      for (let n = 1; n <= 7; n++) {
        const ids = Array.from({ length: n }, (_, i) => `m${i}`);
        expect(sum(splitEqual(total, ids))).toBe(total);
      }
    }
  });

  it("báo lỗi với dữ liệu sai", () => {
    expect(() => splitEqual(0, ["a"])).toThrow();
    expect(() => splitEqual(100.5, ["a"])).toThrow();
    expect(() => splitEqual(100, [])).toThrow();
    expect(() => splitEqual(100, ["a", "a"])).toThrow();
  });
});

describe("splitByWeight", () => {
  it("chia 2:1, phần dư thuộc người có phần lẻ lớn nhất", () => {
    const result = splitByWeight(100000, [
      { memberId: "a", weight: 2 },
      { memberId: "b", weight: 1 },
    ]);
    expect(result.map((r) => r.amount)).toEqual([66667, 33333]);
  });

  it("tổng luôn đúng bằng số tiền gốc", () => {
    const shares = [
      { memberId: "a", weight: 3 },
      { memberId: "b", weight: 5 },
      { memberId: "c", weight: 7 },
    ];
    for (const total of [1, 10, 99999, 100000, 1234567]) {
      expect(sum(splitByWeight(total, shares))).toBe(total);
    }
  });

  it("báo lỗi khi tỷ lệ không hợp lệ", () => {
    expect(() =>
      splitByWeight(1000, [{ memberId: "a", weight: 0 }]),
    ).toThrow();
    expect(() =>
      splitByWeight(1000, [{ memberId: "a", weight: 1.5 }]),
    ).toThrow();
  });
});

describe("splitExact", () => {
  it("chấp nhận khi tổng khớp", () => {
    const items = [
      { memberId: "a", amount: 70000 },
      { memberId: "b", amount: 30000 },
    ];
    expect(splitExact(100000, items)).toEqual(items);
  });

  it("báo lỗi khi tổng lệch", () => {
    expect(() =>
      splitExact(100000, [
        { memberId: "a", amount: 70000 },
        { memberId: "b", amount: 20000 },
      ]),
    ).toThrow();
  });
});