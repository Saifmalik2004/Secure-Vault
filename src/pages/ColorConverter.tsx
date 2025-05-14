import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export function ColorConverter() {
  const { toast } = useToast();
  const [color, setColor] = useState({
    h: 270, // Hue (0-360)
    s: 0.5, // Saturation (0-1)
    l: 0.4, // Lightness (0-1)
    a: 0.5, // Alpha (0-1)
  });
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw saturation/lightness grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = x / width;
        const l = 1 - y / height;
        ctx.fillStyle = `hsl(${color.h}, ${s * 100}%, ${l * 100}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [color.h]);

  // Handle hue slider change
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor((prev) => ({ ...prev, h: parseInt(e.target.value) }));
    setCopied(null);
  };

  // Handle saturation/lightness grid click
  const handleGridClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = x / rect.width;
    const l = 1 - y / rect.height;
    setColor((prev) => ({ ...prev, s, l }));
    setCopied(null);
  };

  // Handle opacity change
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = parseInt(e.target.value) / 100;
    setColor((prev) => ({ ...prev, a }));
    setCopied(null);
  };

  // Handle common color selection
  const handleCommonColorSelect = (newColor: { h: number; s: number; l: number; a: number }) => {
    setColor(newColor);
    setCopied(null);
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h = h % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  };

  // Convert RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  };

  // Copy to clipboard
  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    toast({
      title: `${label} copied!`,
      description: `${value} has been copied to your clipboard.`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  // Common colors definition
  const commonColors = [
    { name: "Red", h: 0, s: 1, l: 0.5, a: 1, rgb: "rgb(255, 0, 0)" },
    { name: "Green", h: 120, s: 1, l: 0.5, a: 1, rgb: "rgb(0, 255, 0)" },
    { name: "Blue", h: 240, s: 1, l: 0.5, a: 1, rgb: "rgb(0, 0, 255)" },
    { name: "Yellow", h: 60, s: 1, l: 0.5, a: 1, rgb: "rgb(255, 255, 0)" },
    { name: "Cyan", h: 180, s: 1, l: 0.5, a: 1, rgb: "rgb(0, 255, 255)" },
    { name: "Magenta", h: 300, s: 1, l: 0.5, a: 1, rgb: "rgb(255, 0, 255)" },
    { name: "Black", h: 0, s: 0, l: 0, a: 1, rgb: "rgb(0, 0, 0)" },
    { name: "White", h: 0, s: 0, l: 1, a: 1, rgb: "rgb(255, 255, 255)" },
    { name: "Semi-Transparent", h: color.h, s: color.s, l: color.l, a: 0.5, rgb: `rgba(${hslToRgb(color.h, color.s, color.l).r}, ${hslToRgb(color.h, color.s, color.l).g}, ${hslToRgb(color.h, color.s, color.l).b}, 0.5)` },
    { name: "Fully Transparent", h: color.h, s: color.s, l: color.l, a: 0, rgb: `rgba(${hslToRgb(color.h, color.s, color.l).r}, ${hslToRgb(color.h, color.s, color.l).g}, ${hslToRgb(color.h, color.s, color.l).b}, 0)` },
  ];

  // Calculate color values
  const rgb = hslToRgb(color.h, color.s, color.l);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hex = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
  const hexa = `${hex}${Math.round(color.a * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()}`;
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${color.a.toFixed(2)})`;
  const hsl = `hsl(${Math.round(color.h)}, ${Math.round(color.s * 100)}%, ${Math.round(color.l * 100)}%)`;
  const hsla = `hsla(${Math.round(color.h)}, ${Math.round(color.s * 100)}%, ${Math.round(color.l * 100)}%, ${color.a.toFixed(2)})`;
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* Left: Custom Color Picker */}
      <div className="w-full md:w-96 flex flex-col gap-4">
        <div className="bg-sidebar border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
            Color Picker
          </h3>
          {/* Saturation/Lightness Grid */}
          <div className="relative w-full h-56 mb-3">
            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              className="w-full h-full rounded-md border border-border cursor-crosshair"
              onClick={handleGridClick}
            />
            <div
              className="absolute w-4 h-4 border-2 border-background rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
              style={{
                left: `${color.s * 100}%`,
                top: `${(1 - color.l) * 100}%`,
                backgroundColor: hsl,
              }}
            />
          </div>
          {/* Hue Slider */}
          <div className="mb-3">
            <h4 className="text-xs font-medium text-sidebar-foreground mb-1.5">
              Hue
            </h4>
            <input
              type="range"
              min="0"
              max="360"
              value={color.h}
              onChange={handleHueChange}
              className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-magenta-500 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Opacity Slider */}
          <div>
            <h4 className="text-xs font-medium text-sidebar-foreground mb-1.5">
              Opacity
            </h4>
            <input
              type="range"
              min="0"
              max="100"
              value={color.a * 100}
              onChange={handleOpacityChange}
              className="w-full h-2 bg-sidebar-accent rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-sm text-sidebar-foreground mt-2">
              {Math.round(color.a * 100)}%
            </p>
          </div>
        </div>
        {/* Common Colors Section */}
        <div className="bg-sidebar border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
            Common Colors
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {commonColors.map((commonColor) => (
              <button
                key={commonColor.name}
                className="w-10 h-10 rounded-md border border-border hover:border-primary transition-colors"
                style={{
                  backgroundColor: commonColor.rgb,
                  backgroundImage:
                    commonColor.name.includes("Transparent")
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(45deg, transparent 25%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 75%)"
                      : "none",
                  backgroundSize:
                    commonColor.name.includes("Transparent")
                      ? "8px 8px"
                      : "auto",
                  backgroundPosition:
                    commonColor.name.includes("Transparent")
                      ? "0 0, 0 4px, 4px 0, 4px 4px"
                      : "0 0",
                }}
                onClick={() =>
                  handleCommonColorSelect({
                    h: commonColor.h,
                    s: commonColor.s,
                    l: commonColor.l,
                    a: commonColor.a,
                  })
                }
                title={commonColor.name}
                aria-label={`Select ${commonColor.name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview and Color Values */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Preview Box */}
        <div className="bg-sidebar border border-border rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
            Preview
          </h3>
          <div
            className="w-full h-32 rounded-md border border-border"
            style={{ backgroundColor: rgba }}
          />
        </div>

        {/* Color Values */}
        {[
          { label: "HEX", value: hex },
          { label: "HEXA", value: hexa },
          { label: "RGB", value: rgbString },
          { label: "RGBA", value: rgba },
          { label: "HSL", value: hsl },
          { label: "HSLA", value: hsla },
          { label: "CMYK", value: cmykString },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-sm text-sidebar-foreground w-16">{label}</span>
            <div className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm">
              {value}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(value, label)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label={`Copy ${label} value`}
            >
              {copied === label ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        ))}
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 0 2px hsl(var(--background));
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: hsl(var(--primary));
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 0 2px hsl(var(--background));
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: hsl(var(--sidebar-accent));
          border-radius: 0.25rem;
          height: 0.5rem;
        }
        input[type="range"]::-moz-range-track {
          background: hsl(var(--sidebar-accent));
          border-radius: 0.25rem;
          height: 0.5rem;
        }
      `}</style>
    </div>
  );
}