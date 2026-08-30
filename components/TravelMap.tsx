"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import type { TravelPlace } from "@/lib/db";
import { useHoverDelay } from "../hooks/useHoverDelay";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const US_STATES_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MIN_ZOOM = 1.2;
const MAX_ZOOM = 10;
const INITIAL_ZOOM_WEB = 1.5;
const INITIAL_ZOOM_MOBILE = 4;
const INITIAL_CENTER_WEB: [number, number] = [5, 12];
const INITIAL_CENTER_MOBILE: [number, number] = [-95, 38];

export default function TravelMap({ places }: { places: TravelPlace[] }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<string, SVGGElement>>(new Map());

  const [zoom, setZoom] = useState(() => {
    if (typeof window === "undefined") return INITIAL_ZOOM_WEB;
    return window.innerWidth < 768 ? INITIAL_ZOOM_MOBILE : INITIAL_ZOOM_WEB;
  });
  const [center, setCenter] = useState<[number, number]>(() => {
    if (typeof window === "undefined") return INITIAL_CENTER_WEB;
    return window.innerWidth < 768 ? INITIAL_CENTER_MOBILE : INITIAL_CENTER_WEB;
  });
  const [openedSlug, setOpenedSlug] = useState<string | null>(null);

  const {
    value: selected,
    show: showPin,
    hide: hidePin,
    keep: keepPin,
    clear: clearSelected,
  } = useHoverDelay<TravelPlace>();

  function closePopup() {
    setOpenedSlug(null);
    clearSelected();
  }

  const visitedCountries = useMemo(
    () =>
      new Set(
        places
          .filter((place) => place.country !== "United States of America")
          .map((place) => place.country),
      ),
    [places],
  );

  const visitedStates = useMemo(
    () =>
      new Set(
        places.flatMap((place) =>
          Array.isArray(place.states) ? place.states : [],
        ),
      ),
    [places],
  );

  const pins = useMemo(
    () =>
      places.filter(
        (place) => place.type === "pin" || place.type === "preview",
      ),
    [places],
  );

  const mapBg = isDark ? "#1A1B1F" : "#FCFCFA";
  const landFill = isDark ? "#2a2d35" : "#F0EEE7";
  const landHover = isDark ? "#363a45" : "#E8E5D8";
  const landStroke = isDark ? "#3a3d47" : "#C7C4B9";
  const visitedFill = isDark ? "#C6005C" : "#FF91B2";
  const visitedHover = isDark ? "#da317d" : "#FF78A0";
  const pinFill = isDark ? "#FF91B2" : "#C6005C";

  function getPinPosition(pin: TravelPlace) {
    const markerElement = markerRefs.current.get(pin.slug);
    const wrapperElement = wrapperRef.current;

    if (!markerElement || !wrapperElement) {
      return null;
    }

    const markerRect = markerElement.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    return {
      x: markerRect.left - wrapperRect.left + markerRect.width / 2,
      y: markerRect.top - wrapperRect.top + markerRect.height / 2,
    };
  }

  function handleZoomIn() {
    setZoom((value) => Math.min(value * 1.5, MAX_ZOOM));
  }

  function handleZoomOut() {
    setZoom((value) => Math.max(value / 1.5, MIN_ZOOM));
  }

  function handleReset() {
    const isMobile = window.innerWidth < 768;
    setZoom(isMobile ? INITIAL_ZOOM_MOBILE : INITIAL_ZOOM_WEB);
    setCenter(isMobile? INITIAL_CENTER_MOBILE : INITIAL_CENTER_WEB);
    closePopup();
  }

  const popupPosition = selected ? getPinPosition(selected) : null;

  return (
    <div>
      <div
        ref={wrapperRef}
        className="relative z-10 rounded-xl border border-line bg-gradient-to-br from-fuchsia/5 via-transparent to-burnt/5 p-2 md:p-4"
      >
        <div
          className="relative aspect-square overflow-hidden rounded-md border border-line dark:border-white/10 sm:aspect-[3/2] md:aspect-[2/1.2]"
          style={{ background: mapBg }}
        >
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 148 }}
            className="h-full w-full [touch-action:none]"
          >
            <ZoomableGroup
              zoom={zoom}
              center={center}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              onMoveStart={closePopup}
              onMoveEnd={({ zoom: nextZoom, coordinates }) => {
                setZoom(nextZoom);
                setCenter(coordinates);
              }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = String(geo.properties?.name ?? "");
                    const isVisited = visitedCountries.has(countryName);
                    const isUS = countryName === "United States of America";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isVisited ? visitedFill : landFill}
                        stroke={landStroke}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: isUS
                            ? { outline: "none" }
                            : {
                                outline: "none",
                                fill: isVisited ? visitedHover : landHover,
                              },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              <Geographies geography={US_STATES_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = String(geo.properties?.name ?? "");
                    const isVisited = visitedStates.has(stateName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isVisited ? visitedFill : landFill}
                        stroke={landStroke}
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            outline: "none",
                            fill: isVisited ? visitedHover : landHover,
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {pins.map((pin) => (
                <Marker key={pin.slug} coordinates={[pin.lon, pin.lat]}>
                  <g
                    ref={(element) => {
                      if (element) {
                        markerRefs.current.set(pin.slug, element);
                      } else {
                        markerRefs.current.delete(pin.slug);
                      }
                    }}
                    className="group cursor-pointer"
                    data-cursor-hover
                    transform={`scale(${1 / zoom})`}
                    onMouseEnter={() => {
                      if (openedSlug && openedSlug !== pin.slug) {
                        setOpenedSlug(null);
                      }
                      showPin(pin);
                    }}
                    onMouseLeave={() => {
                      if (openedSlug === pin.slug) return;
                      hidePin();
                    }}
                    onClick={() => {
                      showPin(pin);
                      if (pin.type === "pin") {
                        setOpenedSlug(pin.slug);
                        keepPin();
                      }
                    }}
                  >
                    <circle r={14} fill="transparent" />

                    {pin.home ? (
                      <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        fontSize={20}
                        fill="#FFD700"
                      >
                        ★
                      </text>
                    ) : (
                      <circle r={6} fill={pinFill} />
                    )}
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          <div className="absolute right-2.5 top-2.5 flex flex-col overflow-hidden rounded border border-line dark:border-white/10">
            <button
              type="button"
              onClick={handleZoomIn}
              className="h-9 w-9 border-b border-line bg-paper font-mono text-sm text-ink hover:bg-fuchsia hover:text-white dark:border-white/10 dark:bg-ink dark:text-white/70 md:h-6 md:w-7"
              aria-label="Zoom in"
            >
              +
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              className="h-9 w-9 border-b border-line bg-paper font-mono text-sm text-ink hover:bg-fuchsia hover:text-white dark:border-white/10 dark:bg-ink dark:text-white/70 md:h-6 md:w-7"
              aria-label="Zoom out"
            >
              –
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-9 w-9 bg-paper font-mono text-sm text-ink hover:bg-fuchsia hover:text-white dark:bg-ink dark:text-white/70 md:h-6 md:w-7"
              aria-label="Reset zoom"
            >
              ⟲
            </button>
          </div>

          <div className="absolute bottom-2.5 left-2.5 hidden font-mono text-xs text-muted dark:text-white/30 md:block">
            scroll or drag to explore · hover over a pin to preview
          </div>
        </div>

        {selected && popupPosition && (
          <TravelMapPopup
            place={selected}
            position={popupPosition}
            isDark={isDark}
            onKeep={keepPin}
            onHide={() => {
              if (openedSlug !== selected.slug) {
                hidePin();
              }
            }}
            onNavigate={
              selected.type === "pin"
                ? () => router.push(`/travel/${selected.slug}`)
                : undefined
            }
          />
        )}
      </div>

      <div className="mt-2 md:mt-5 flex flex-wrap items-center gap-6 pl-2 md:pl-4 font-mono text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: pinFill }}
          />
          pic(s) included
        </span>

        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-lg"
            style={{ backgroundColor: visitedFill }}
          />
          visited
        </span>

        <span className="flex items-center gap-1.5">
          <span className="-translate-y-1 text-3xl text-[#FFD700]">★</span>
          home
        </span>
      </div>
    </div>
  );
}

type TravelMapPopupProps = {
  place: TravelPlace;
  position: { x: number; y: number };
  isDark: boolean;
  onKeep: () => void;
  onHide: () => void;
  onNavigate?: () => void;
};

function TravelMapPopup({
  place,
  position,
  isDark,
  onKeep,
  onHide,
  onNavigate,
}: TravelMapPopupProps) {
  return (
    <div
      className="pointer-events-auto absolute z-20 w-[100px] md:w-[80px]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, calc(-100% - 8px))",
      }}
      onMouseEnter={onKeep}
      onMouseLeave={onHide}
    >
      <div
        className={`overflow-hidden rounded-lg border border-line bg-paper shadow-2xl transition-colors dark:border-white/10 dark:bg-[#1E1F24] ${
          onNavigate ? "cursor-pointer hover:border-fuchsia" : ""
        }`}
        onClick={onNavigate}
      >
        {place.cover_url ? (
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={place.cover_url}
              alt={place.name}
              fill
              sizes="100px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-fuchsia/10 to-burnt/10" />
        )}

        <div className="px-1.5 py-1">
          <div className="flex items-center justify-between gap-1">
            <p className="min-w-0 truncate font-display text-[10px] font-medium leading-snug text-ink dark:text-white/80">
              {place.name}
            </p>

            {place.type === "pin" && (
              <img
                src="/icons/open_in_new.svg"
                alt=""
                aria-hidden="true"
                className="h-3 w-3 shrink-0"
              />
            )}
          </div>

          {place.date && (
            <p className="mt-0.5 font-mono text-[7px] text-muted">
              {place.date}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: isDark ? "6px solid #1E1F24" : "6px solid #FCFCFA",
          }}
        />
      </div>
    </div>
  );
}
