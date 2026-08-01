export default function RiskWarning() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-6 py-3"
      style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
    >
      <p className="text-[11px] text-center leading-relaxed" style={{ color: "#9B9590" }}>
        CFD and FX Margin are leveraged products that carry a high risk of loss to your capital. Trading is not suitable for everyone and can result in losses far greater than your initial investment. You do not own or have rights to the underlying assets. Do not risk funds you cannot afford to lose.
      </p>
    </div>
  );
}
