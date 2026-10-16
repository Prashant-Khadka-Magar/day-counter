
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Our configuration
const START_YEAR = 2026;
const START_MONTH = 10;
const START_DAY = 16;

const WIDTH = 2560;
const HEIGHT = 1600;

const outputDirectory = join(
  homedir(),
  "Pictures",
  "DayCounter",
);

function calculateDayNumber(today: Date): number {
  // Use calendar dates to avoid daylight-saving errors.
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startUTC = Date.UTC(
    START_YEAR,
    START_MONTH - 1,
    START_DAY,
  );

  const millisecondsPerDay = 86_400_000;

  return (
    Math.round(
      (todayUTC - startUTC) / millisecondsPerDay,
    ) + 1
  );
}

async function main(): Promise<void> {
  const today = new Date();
  const dayNumber = calculateDayNumber(today);

  if (dayNumber < 1) {
    throw new Error("Start date is in the future.");
  }

  const dayText = `DAY ${String(dayNumber).padStart(3, "0")}`;

  const dateText = today
    .toLocaleDateString("en-CA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  // SVG defines the visual design.
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}"
         xmlns="http://www.w3.org/2000/svg">

      <rect width="100%" height="100%"
            fill="#1a1b26"/>

      <g text-anchor="middle"
         font-family="DejaVu Sans, sans-serif">

        <text x="1280" y="570"
              fill="#7aa2f7" font-size="31">
          THE JOURNEY CONTINUES
        </text>

        <text x="1280" y="830"
              fill="#c0caf5"
              font-size="200"
              font-weight="bold">
          ${dayText}
        </text>

        <text x="1280" y="950"
              fill="#9aa5ce"
              font-size="36">
          ${dateText}
        </text>

        <rect x="1215" y="1010"
              width="130" height="4"
              rx="2" fill="#7aa2f7"/>

        <text x="1280" y="1100"
              fill="#787c99"
              font-size="27">
          ONE DAY AT A TIME.
        </text>

      </g>
    </svg>
  `;

  await mkdir(outputDirectory, { recursive: true });

  const dateId = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const outputPath = join(
    outputDirectory,
    `day-${dateId}.png`,
  );

  // Convert SVG to PNG.
  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  // Tell GNOME to display our new image.
  const wallpaperURI = pathToFileURL(outputPath).href;

  for (const key of ["picture-uri", "picture-uri-dark"]) {
    execFileSync("gsettings", [
      "set",
      "org.gnome.desktop.background",
      key,
      wallpaperURI,
    ]);
  }

  console.log(`Wallpaper updated: ${dayText}`);
  console.log(`Saved at: ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error("Failed to update wallpaper:", error);
  process.exitCode = 1;
});
