import PixelBlast from "@/components/PixelBlast";

export default function T() {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <PixelBlast variant="square" pixelSize={4} color="#B497CF" enableRipples liquid noiseAmount={0.1} />
    </div>
  );
}
