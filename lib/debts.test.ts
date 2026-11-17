import { describe, it, expect } from "vitest";
import { computeBalances, simplifyDebts } from "./debts";

const dinner = {
  paidById: "A",
  amount: 300000,
  splits: [
    { memberId: "A", amountOwed: 100000 },
    { memberId: "B", amountOwed: 100000 },
    { memberId: "C", amountOwed: 100000 },
  ],
};

describe("computeBalances", () => {
  it("người trả được cộng, người dùng chung bị trừ", () => {
    expect(computeBalances([dinner])).toEqual({
      A: 200000,
      B: -100000,
      C: -100000,
    });
  });

  it("trừ đi khoản đã trả nợ", () => {
    const balances = computeBalances(
      [dinner],
      [{ fromMemberId: "B", toMemberId: "A", amount: 100000 }],
    );
    expect(balances).toEqual({ A: 100000, B: 0, C: -100000 });
  });
});

describe("simplifyDebts", () => {
  it("hai người cùng nợ một người", () => {
    const transfers = simplifyDebts({ A: 200000, B: -100000, C: -100000 });
    expect(transfers).toEqual([
      { from: "B", to: "A", amount: 100000 },
      { from: "C", to: "A", amount: 100000 },
    ]);
  });

  it("nợ dây chuyền A→B→C rút gọn thành A→C", () => {
    const transfers = simplifyDebts({ A: -100, B: 0, C: 100 });
    expect(transfers).toEqual([{ from: "A", to: "C", amount: 100 }]);
  });

  it("sau khi thực hiện các giao dịch thì mọi số dư về 0", () => {
    const balances = { A: 50, B: 30, C: -20, D: -60 };
    const transfers = simplifyDebts(balances);

    const after: Record<string, number> = { ...balances };
    for (const t of transfers) {
      after[t.from] += t.amount;
      after[t.to] -= t.amount;
    }
    expect(Object.values(after).every((v) => v === 0)).toBe(true);
    expect(transfers.length).toBeLessThanOrEqual(3); // tối đa n - 1
  });

  it("không có nợ thì không có giao dịch", () => {
    expect(simplifyDebts({ A: 0, B: 0 })).toEqual([]);
  });

  it("báo lỗi khi tổng số dư khác 0", () => {
    expect(() => simplifyDebts({ A: 100, B: -50 })).toThrow();
  });
});