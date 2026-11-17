import { Avatar } from "@/components/ui";

// Hình minh họa, không phải mã QR thật
const QR = [
  "1110111",
  "1010101",
  "1110111",
  "0100010",
  "1110101",
  "1010011",
  "1110110",
];

function Row({
  title,
  note,
  amount,
}: {
  title: string;
  note: string;
  amount: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <dt className="font-semibold">{title}</dt>
        <dd className="text-sm text-muted">{note}</dd>
      </div>
      <dd className="font-bold tabular-nums">{amount}</dd>
    </div>
  );
}

export function ReceiptPreview() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-sm rounded-3xl bg-white shadow-[0_24px_50px_-20px_rgba(36,27,75,0.35)] md:rotate-2"
    >
      <div className="px-6 pt-6 pb-5">
        <p className="font-display text-2xl font-bold">Đà Lạt 2026</p>
        <p className="text-sm text-muted">3 bạn, 2 khoản chi</p>
        <dl className="mt-4 space-y-3">
          <Row title="Homestay" note="Nam trả" amount="1.200.000đ" />
          <Row title="Ăn tối BBQ" note="Linh trả" amount="600.000đ" />
        </dl>
      </div>

      <div className="relative">
        <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-canvas" />
        <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-canvas" />
        <div className="mx-5 border-t-2 border-dashed border-line" />
      </div>

      <div className="px-6 pt-5 pb-6">
        <p className="text-sm font-semibold text-muted">Cần chuyển</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name="Huy" size={40} />
            <p className="font-medium">Huy chuyển cho Nam</p>
          </div>
          <p className="font-bold tabular-nums text-coral">600.000đ</p>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-sun/30 p-4">
          <div className="grid shrink-0 grid-cols-7 gap-[2px] rounded-lg bg-white p-2">
            {QR.flatMap((row, r) =>
              row.split("").map((cell, c) => (
                <span
                  key={`${r}-${c}`}
                  className={`h-1.5 w-1.5 ${cell === "1" ? "bg-ink" : ""}`}
                />
              )),
            )}
          </div>
          <p className="text-sm leading-snug font-medium">
            Quét mã để chuyển đúng 600.000đ. Gộp 3 khoản nợ thành 1 lần chuyển.
          </p>
        </div>
      </div>
    </div>
  );
}
