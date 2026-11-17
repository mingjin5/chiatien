export type SplitItem = { memberId: string; amount: number };

function assertValidTotal(total: number) {
  if (!Number.isInteger(total) || total <= 0) {
    throw new Error("Số tiền phải là số nguyên dương (đơn vị đồng)");
  }
}

function assertUniqueMembers(ids: string[]) {
  if (ids.length === 0) throw new Error("Cần ít nhất 1 người để chia");
  if (new Set(ids).size !== ids.length) {
    throw new Error("Danh sách thành viên bị trùng");
  }
}

// Chia đều. Phần dư (mỗi người 1 đồng) được phân cho những người đầu danh sách.
// Nơi gọi hàm nên sắp xếp memberIds theo một thứ tự cố định.
export function splitEqual(total: number, memberIds: string[]): SplitItem[] {
  assertValidTotal(total);
  assertUniqueMembers(memberIds);

  const base = Math.floor(total / memberIds.length);
  const remainder = total - base * memberIds.length;

  return memberIds.map((memberId, i) => ({
    memberId,
    amount: base + (i < remainder ? 1 : 0),
  }));
}

// Chia theo tỷ lệ (weight là số nguyên dương, ví dụ 2:1:1 hoặc 50:30:20).
// Dùng phương pháp "phần dư lớn nhất": làm tròn xuống, rồi phát số đồng còn thiếu
// cho người có phần lẻ lớn nhất. Tổng luôn đúng bằng total.
export function splitByWeight(
  total: number,
  shares: { memberId: string; weight: number }[],
): SplitItem[] {
  assertValidTotal(total);
  assertUniqueMembers(shares.map((s) => s.memberId));
  if (shares.some((s) => !Number.isInteger(s.weight) || s.weight <= 0)) {
    throw new Error("Tỷ lệ phải là số nguyên dương");
  }

  const totalWeight = shares.reduce((sum, s) => sum + s.weight, 0);

  const parts = shares.map((s, index) => {
    const numerator = total * s.weight;
    const floor = Math.floor(numerator / totalWeight);
    // Dùng số dư nguyên để so sánh, tránh sai số số thực
    const fraction = numerator - floor * totalWeight;
    return { index, memberId: s.memberId, floor, fraction };
  });

  const leftover = total - parts.reduce((sum, p) => sum + p.floor, 0);
  const order = [...parts].sort(
    (a, b) => b.fraction - a.fraction || a.index - b.index,
  );
  const extra = new Set(order.slice(0, leftover).map((p) => p.index));

  return parts.map((p) => ({
    memberId: p.memberId,
    amount: p.floor + (extra.has(p.index) ? 1 : 0),
  }));
}

// Nhập tay số tiền từng người: kiểm tra tổng phải khớp.
export function splitExact(total: number, items: SplitItem[]): SplitItem[] {
  assertValidTotal(total);
  assertUniqueMembers(items.map((i) => i.memberId));
  if (items.some((i) => !Number.isInteger(i.amount) || i.amount < 0)) {
    throw new Error("Số tiền mỗi người phải là số nguyên không âm");
  }
  const sum = items.reduce((s, i) => s + i.amount, 0);
  if (sum !== total) {
    throw new Error(`Tổng các phần (${sum}) phải bằng ${total}`);
  }
  return items.map((i) => ({ ...i }));
}