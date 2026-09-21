export const MARK_SRC = "/brand/ad-mark.png";
export const MARK_WIDTH = 500;
export const MARK_HEIGHT = 330;

type MonogramProps = {
  className?: string;
  title?: string;
  decorative?: boolean;
};

export function Monogram({
  className,
  title = "Aditya Dutta",
  decorative = false,
}: MonogramProps) {
  return (
    <img
      className={className}
      src={MARK_SRC}
      alt={decorative ? "" : title}
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      draggable={false}
    />
  );
}

/** Nested `<image>` so the mark can sit inside another SVG artboard. */
export function MonogramGlyph({
  className,
  x,
  y,
  width,
  height,
}: {
  className?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return (
    <image
      className={className}
      href={MARK_SRC}
      x={x}
      y={y}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
