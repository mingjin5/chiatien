export type ExpenseInput = {
  paidById: string;
  amount: number;
  splits: { memberId: string; amountOwed: number }[];
};

// Chỉ truyền vào các khoản đã được xác nhận (CONFIRMED)
export type SettlementInput = {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
};

export type Transfer = { from: string; to: string; amount: number };

// Số dư > 0: người này được nhận tiền. Số dư < 0: người này đang nợ.
export function computeBalances(
  expenses: ExpenseInput[],
  settlements: SettlementInput[] = [],
): Record<string, number> {
  const balances: Record<string, number> = {};
  const add = (id: string, delta: number) => {
    balances[id] = (balances[id] ?? 0) + delta;
  };

  for (const e of expenses) {
    add(e.paidById, e.amount);
    for (const s of e.splits) add(s.memberId, -s.amountOwed);
  }
  for (const s of settlements) {
    add(s.fromMemberId, s.amount);
    add(s.toMemberId, -s.amount);
  }
  return balances;
}

type Party = { id: string; amount: number };
const byAmountDesc = (a: Party, b: Party) =>
  b.amount - a.amount || a.id.localeCompare(b.id);

// Thuật toán tham lam: ghép người nợ nhiều nhất với người được nhận nhiều nhất.
// Số giao dịch tối đa là (số người - 1).
export function simplifyDebts(balances: Record<string, number>): Transfer[] {
  const entries = Object.entries(balances);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  if (sum !== 0) throw new Error("Tổng số dư phải bằng 0");

  const creditors: Party[] = entries
    .filter(([, v]) => v > 0)
    .map(([id, amount]) => ({ id, amount }));
  const debtors: Party[] = entries
    .filter(([, v]) => v < 0)
    .map(([id, v]) => ({ id, amount: -v }));

  const transfers: Transfer[] = [];
  while (creditors.length > 0 && debtors.length > 0) {
    creditors.sort(byAmountDesc);
    debtors.sort(byAmountDesc);
    const c = creditors[0];
    const d = debtors[0];
    const amount = Math.min(c.amount, d.amount);

    transfers.push({ from: d.id, to: c.id, amount });
    c.amount -= amount;
    d.amount -= amount;
    if (c.amount === 0) creditors.shift();
    if (d.amount === 0) debtors.shift();
  }
  return transfers;
}