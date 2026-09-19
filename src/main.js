import "./style.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

document.querySelector("#app").innerHTML = `
  <div class="app">
    <header class="header">
      <div>
        <p class="eyebrow">PERSONAL DRIVING LOG</p>
        <h1>Drive Tracker</h1>
      </div>

      <div
        class="status-dot"
        id="statusDot"
      ></div>
    </header>

    <main>
      <!-- =========================================
           HOME PAGE
           ========================================= -->

      <section
        class="page"
        id="homePage"
      >
        <section class="hero-card">
          <div class="hero-label">
            CURRENT SPEED
          </div>

          <div class="speed">
            <span id="speed">0</span>
            <span class="speed-unit">
              km/h
            </span>
          </div>

          <div
            class="drive-state"
            id="driveState"
          >
            Ready to record
          </div>

          <button
            class="start-button"
            id="startButton"
            type="button"
          >
            START DRIVE
          </button>

          <p
            class="gps-message"
            id="gpsMessage"
          ></p>
        </section>

        <section class="stats-grid">
          <div class="stat-card">
            <span>Duration</span>
            <strong id="duration">
              00:00:00
            </strong>
          </div>

          <div class="stat-card">
            <span>Distance</span>
            <strong id="distance">
              0.00 km
            </strong>
          </div>

          <div class="stat-card">
            <span>Top speed</span>
            <strong id="topSpeed">
              0 km/h
            </strong>
          </div>

          <div class="stat-card">
            <span>Average</span>
            <strong id="averageSpeed">
              0 km/h
            </strong>
          </div>

          <div class="stat-card">
            <span>Moving time</span>
            <strong id="movingTime">
              00:00:00
            </strong>
          </div>

          <div class="stat-card">
            <span>Stopped time</span>
            <strong id="stoppedTime">
              00:00:00
            </strong>
          </div>
        </section>

        <section class="map-section">
          <div class="section-heading">
            <h2>Current Route</h2>
          </div>

          <div id="map"></div>

          <div class="speed-legend">
            <div class="legend-item">
              <span
                class="legend-color blue"
              ></span>
              <span>0–10</span>
            </div>

            <div class="legend-item">
              <span
                class="legend-color green"
              ></span>
              <span>10–40</span>
            </div>

            <div class="legend-item">
              <span
                class="legend-color yellow"
              ></span>
              <span>40–70</span>
            </div>

            <div class="legend-item">
              <span
                class="legend-color orange"
              ></span>
              <span>70–100</span>
            </div>

            <div class="legend-item">
              <span
                class="legend-color red"
              ></span>
              <span>100+</span>
            </div>

            <span class="legend-unit">
              km/h
            </span>
          </div>
        </section>
      </section>

      <!-- =========================================
           DRIVES PAGE
           ========================================= -->

      <section
        class="page"
        id="drivesPage"
        hidden
      >
        <section class="overall-section">
          <div class="section-heading">
            <h2>Driving Summary</h2>
          </div>

          <section
            class="stats-grid overall-stats"
          >
            <div class="stat-card">
              <span>Total Drives</span>
              <strong id="totalDrives">
                0
              </strong>
            </div>

            <div class="stat-card">
              <span>Total Distance</span>
              <strong id="totalDistance">
                0.00 km
              </strong>
            </div>

            <div class="stat-card">
              <span>Highest Speed Ever</span>
              <strong id="highestSpeed">
                0 km/h
              </strong>
            </div>

            <div class="stat-card">
              <span>Total Driving Time</span>
              <strong id="totalDrivingTime">
                00:00:00
              </strong>
            </div>
          </section>
        </section>

        <section class="history-section">
          <div class="section-heading">
            <h2>Drive History</h2>

            <span id="driveCount">
              0 drives
            </span>
          </div>

          <div
            id="history"
            class="history-empty"
          >
            Your completed drives will
            appear here.
          </div>
        </section>
      </section>
    </main>

    <!-- =========================================
         BOTTOM NAVIGATION
         ========================================= -->

    <nav
      class="bottom-nav"
      aria-label="Main navigation"
    >
      <button
        type="button"
        class="nav-tab active"
        id="homeTab"
        data-tab="home"
      >
        <span class="nav-icon home-icon">
          ⌂
        </span>

        <span>Home</span>
      </button>

      <button
        type="button"
        class="nav-tab"
        id="drivesTab"
        data-tab="drives"
      >
        <span class="nav-icon">
          🚗
        </span>

        <span>Drives</span>
      </button>
    </nav>
  </div>
`;

/* =========================================================
   DOM REFERENCES
   ========================================================= */

const startButton =
  document.querySelector(
    "#startButton"
  );

const driveState =
  document.querySelector(
    "#driveState"
  );

const gpsMessage =
  document.querySelector(
    "#gpsMessage"
  );

const speedDisplay =
  document.querySelector(
    "#speed"
  );

const durationDisplay =
  document.querySelector(
    "#duration"
  );

const distanceDisplay =
  document.querySelector(
    "#distance"
  );

const topSpeedDisplay =
  document.querySelector(
    "#topSpeed"
  );

const averageSpeedDisplay =
  document.querySelector(
    "#averageSpeed"
  );

const movingTimeDisplay =
  document.querySelector(
    "#movingTime"
  );

const stoppedTimeDisplay =
  document.querySelector(
    "#stoppedTime"
  );

const statusDot =
  document.querySelector(
    "#statusDot"
  );

const historyElement =
  document.querySelector(
    "#history"
  );

const homePage =
  document.querySelector(
    "#homePage"
  );

const drivesPage =
  document.querySelector(
    "#drivesPage"
  );

const homeTab =
  document.querySelector(
    "#homeTab"
  );

const drivesTab =
  document.querySelector(
    "#drivesTab"
  );

const totalDrivesDisplay =
  document.querySelector(
    "#totalDrives"
  );

const totalDistanceDisplay =
  document.querySelector(
    "#totalDistance"
  );

const highestSpeedDisplay =
  document.querySelector(
    "#highestSpeed"
  );

const totalDrivingTimeDisplay =
  document.querySelector(
    "#totalDrivingTime"
  );

const driveCount =
  document.querySelector(
    "#driveCount"
  );

  const historyList =
  document.querySelector(
    "#history"
  );
/* =========================================================
   DRIVE STATE
   ========================================================= */

let driving = false;

let startTime = null;
let timer = null;
let watchId = null;
let nativeLocationActive = false;

let lastPosition = null;

let totalDistance = 0;
let topSpeed = 0;

let speedSamples = [];
let routePoints = [];

let homeRouteSegments = [];

let homeStartMarker = null;
let homeEndMarker = null;
let liveLocationMarker = null;

let selectedDriveId = null;

let currentTab = "home";

let historyMap = null;
let historyLocationUpdateInProgress = false;

/* =========================================================
   MOVING / STOPPED TIME
   ========================================================= */

let movingTime = 0;
let stoppedTime = 0;

let lastTimeSample = null;
let currentlyMoving = false;

const MOVING_CONFIRMATION_THRESHOLD_KMH = 3;

const MOVING_CONFIRMATIONS_REQUIRED = 3;
const STOPPED_CONFIRMATIONS_REQUIRED = 3;

const STATIONARY_DRIFT_METERS = 8;
const MAX_ACCEPTED_SPEED_KMH = 220;

let movementConfirmations = 0;
let stoppedConfirmations = 0;
let filteredSpeed = 0;
let recentSpeedSamples = [];

/* =========================================================
   HOME MAP
   ========================================================= */

const map = L.map(
  "map"
).setView(
  [9.9312, 76.2673],
  9
);

L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,

    attribution:
      "&copy; OpenStreetMap contributors",
  }
).addTo(map);

/* =========================================================
   MAP LOCATION BUTTON
   ========================================================= */

function addLocationButton(
  mapInstance
) {
  const control =
    L.control({
      position:
        "bottomright",
    });

  control.onAdd =
    function () {
      const button =
        L.DomUtil.create(
          "button",
          "map-location-button"
        );

      button.type =
        "button";

      button.title =
        "Center on current location";

      button.setAttribute(
        "aria-label",
        "Center on current location"
      );

      button.innerHTML = `
        <span class="location-crosshair">
          <span></span>
        </span>
      `;

      L.DomEvent.disableClickPropagation(
        button
      );

      L.DomEvent.on(
        button,
        "click",
        () => {
          centerOnCurrentLocation(
            mapInstance
          );
        }
      );

      return button;
    };

  control.addTo(
    mapInstance
  );
}

addLocationButton(map);

/* =========================================================
   MARKER ICONS
   ========================================================= */

function createLocationIcon(
  type
) {
  const isStart =
    type === "start";

  const color =
    isStart
      ? "#30d158"
      : "#ff453a";

  return L.divIcon({
    className:
      "location-marker-wrapper",

    html: `
      <div style="
        width:34px;
        height:34px;
        background:${color};
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-sizing:border-box;
        box-shadow:0 3px 10px rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <span style="
          width:9px;
          height:9px;
          background:#fff;
          border-radius:50%;
          display:block;
          transform:rotate(45deg);
        "></span>
      </div>
    `,

    iconSize: [
      34,
      34,
    ],

    iconAnchor: [
      17,
      34,
    ],

    popupAnchor: [
      0,
      -30,
    ],
  });
}

const startLocationIcon =
  createLocationIcon(
    "start"
  );

const finishLocationIcon =
  createLocationIcon(
    "finish"
  );

const liveLocationIcon =
  L.divIcon({
    className:
      "live-location-marker-wrapper",

    html: `
      <div class="live-location-pulse">
        <span></span>
      </div>
    `,

    iconSize: [
      24,
      24,
    ],

    iconAnchor: [
      12,
      12,
    ],
  });

/* =========================================================
   CENTER ON CURRENT LOCATION
   ========================================================= */

function centerOnCurrentLocation(
  mapInstance
) {
  if (lastPosition) {
    mapInstance.setView(
      [
        lastPosition.latitude,
        lastPosition.longitude,
      ],
      Math.max(
        mapInstance.getZoom(),
        16
      ),
      {
        animate: true,
      }
    );

    return;
  }

  if (
    !navigator.geolocation
  ) {
    gpsMessage.textContent =
      "GPS is not supported by this browser.";

    return;
  }

  gpsMessage.textContent =
    "Getting your current location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude =
        position.coords
          .latitude;

      const longitude =
        position.coords
          .longitude;

      mapInstance.setView(
        [
          latitude,
          longitude,
        ],
        16,
        {
          animate: true,
        }
      );

      gpsMessage.textContent =
        `GPS accuracy: ±${Math.round(
          position.coords.accuracy
        )} m`;
    },

    () => {
      gpsMessage.textContent =
        "Unable to get your current location.";
    },

    {
      enableHighAccuracy:
        true,

      maximumAge:
        1000,

      timeout:
        10000,
    }
  );
}

/* =========================================================
   LIVE LOCATION MARKER
   ========================================================= */

function updateLiveLocationMarker(
  latitude,
  longitude
) {
  if (
    !liveLocationMarker
  ) {
    liveLocationMarker =
      L.marker(
        [
          latitude,
          longitude,
        ],
        {
          icon:
            liveLocationIcon,

          zIndexOffset:
            2000,

          interactive:
            false,
        }
      ).addTo(map);
  } else {
    liveLocationMarker.setLatLng(
      [
        latitude,
        longitude,
      ]
    );
  }
}

function removeLiveLocationMarker() {
  if (
    liveLocationMarker
  ) {
    map.removeLayer(
      liveLocationMarker
    );

    liveLocationMarker =
      null;
  }
}

/* =========================================================
   FORMATTING
   ========================================================= */

function formatDuration(
  milliseconds
) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        milliseconds / 1000
      )
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds %
        3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map(
      (value) =>
        value
          .toString()
          .padStart(
            2,
            "0"
          )
    )
    .join(":");
}

function formatChartTime(
  timestamp,
  firstTimestamp
) {
  const elapsedSeconds =
    Math.max(
      0,
      Math.round(
        (timestamp - firstTimestamp) /
          1000
      )
    );

  const minutes =
    Math.floor(
      elapsedSeconds / 60
    );

  const remainingSeconds =
    elapsedSeconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(
      2,
      "0"
    )}`;
}

function formatDate(
  timestamp
) {
  return new Date(
    timestamp
  ).toLocaleDateString(
    [],
    {
      weekday:
        "long",

      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",
    }
  );
}

function formatTime(
  timestamp
) {
  return new Date(
    timestamp
  ).toLocaleTimeString(
    [],
    {
      hour:
        "2-digit",

      minute:
        "2-digit",

      second:
        "2-digit",
    }
  );
}

function locationText(
  location
) {
  const rawLocation =
    typeof location ===
    "string"
      ? location
      : location?.display_name ||
        location?.name ||
        "";

  if (
    !rawLocation
  ) {
    return "Location unavailable";
  }

  const parts = rawLocation
    .split(",")
    .map(
      (part) =>
        part.trim()
    )
    .filter(Boolean);

  return parts
    .slice(0, 3)
    .join(", ");
}

/* =========================================================
   DISTANCE CALCULATION
   ========================================================= */

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadius =
    6371;

  const dLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) *
      Math.PI) /
    180;

  const a =
    Math.sin(
      dLat / 2
    ) ** 2 +
    Math.cos(
      (lat1 * Math.PI) /
        180
    ) *
      Math.cos(
        (lat2 * Math.PI) /
          180
      ) *
      Math.sin(
        dLon / 2
      ) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

/* =========================================================
   SPEED COLORS
   ========================================================= */

function getSpeedColor(
  speed
) {
  if (speed >= 100) {
    return "#ff453a";
  }

  if (speed >= 70) {
    return "#ff9f0a";
  }

  if (speed >= 40) {
    return "#ffe600";
  }

  if (speed >= 10) {
    return "#30d158";
  }

  return "#0a84ff";
}

/* =========================================================
   CLEAR HOME MAP
   ========================================================= */

function clearHomeMap() {
  homeRouteSegments.forEach(
    (segment) => {
      map.removeLayer(
        segment
      );
    }
  );

  homeRouteSegments =
    [];

  if (
    homeStartMarker
  ) {
    map.removeLayer(
      homeStartMarker
    );

    homeStartMarker =
      null;
  }

  if (
    homeEndMarker
  ) {
    map.removeLayer(
      homeEndMarker
    );

    homeEndMarker =
      null;
  }
}

/* =========================================================
   DRAW SPEED-COLORED ROUTE
   ========================================================= */

function drawSpeedColoredRoute(
  mapInstance,
  segments,
  points
) {
  if (
    !points ||
    points.length < 2
  ) {
    return;
  }

  for (
    let i = 1;
    i < points.length;
    i += 1
  ) {
    const previous =
      points[i - 1];

    const current =
      points[i];

    const segment =
      L.polyline(
        [
          [
            previous.latitude,
            previous.longitude,
          ],

          [
            current.latitude,
            current.longitude,
          ],
        ],
        {
          color:
            getSpeedColor(
              Number(
                current.speed
              ) || 0
            ),

          weight:
            5,

          opacity:
            1,

          lineJoin:
            "round",

          lineCap:
            "round",
        }
      ).addTo(
        mapInstance
      );

    if (segments) {
      segments.push(
        segment
      );
    }
  }
}/* =========================================================
   CURRENT AVERAGE SPEED
   ========================================================= */

function calculateCurrentAverageSpeed() {
  if (
    totalDistance <= 0 ||
    !startTime
  ) {
    return 0;
  }

  const elapsedHours =
    (Date.now() -
      startTime) /
    3600000;

  if (
    elapsedHours <= 0
  ) {
    return 0;
  }

  return (
    totalDistance /
    elapsedHours
  );
}

/* =========================================================
   LIVE MOVING / STOPPED TIME
   ========================================================= */

function getLiveMovingTime() {
  if (
    !driving ||
    !startTime
  ) {
    return movingTime;
  }

  const now =
    Date.now();

  const extra =
    currentlyMoving &&
    lastTimeSample
      ? Math.max(
          0,
          now -
            lastTimeSample
        )
      : 0;

  return (
    movingTime +
    extra
  );
}

function getLiveStoppedTime() {
  if (
    !driving ||
    !startTime
  ) {
    return stoppedTime;
  }

  const now =
    Date.now();

  const extra =
    !currentlyMoving &&
    lastTimeSample
      ? Math.max(
          0,
          now -
            lastTimeSample
        )
      : 0;

  return (
    stoppedTime +
    extra
  );
}

function updateMotionTime(
  now,
  isMoving
) {
  if (
    !lastTimeSample
  ) {
    lastTimeSample =
      now;

    currentlyMoving =
      isMoving;

    return;
  }

  const elapsed =
    Math.max(
      0,
      now -
        lastTimeSample
    );

  if (
    currentlyMoving
  ) {
    movingTime +=
      elapsed;
  } else {
    stoppedTime +=
      elapsed;
  }

  lastTimeSample =
    now;

  currentlyMoving =
    isMoving;
}

/* =========================================================
   OVERALL DRIVING STATS
   ========================================================= */

function updateOverallStats() {
  const drives =
    getSavedDrives();

  const totalDistance =
    drives.reduce(
      (total, drive) =>
        total +
        (Number(
          drive.distance
        ) || 0),
      0
    );

  const highestSpeed =
    drives.reduce(
      (highest, drive) =>
        Math.max(
          highest,
          Number(
            drive.topSpeed
          ) || 0
        ),
      0
    );

  const totalDrivingTime =
    drives.reduce(
      (total, drive) =>
        total +
        (Number(
          drive.duration
        ) || 0),
      0
    );

  totalDrivesDisplay.textContent =
    drives.length;

  totalDistanceDisplay.textContent =
    `${totalDistance.toFixed(
      2
    )} km`;

  highestSpeedDisplay.textContent =
    `${Math.round(
      highestSpeed
    )} km/h`;

  totalDrivingTimeDisplay.textContent =
    formatDuration(
      totalDrivingTime
    );
}

/* =========================================================
   TAB SWITCHING
   ========================================================= */

function activateTab(
  tab
) {
  currentTab =
    tab;

  const isHome =
    tab === "home";

  homePage.hidden =
    !isHome;

  drivesPage.hidden =
    isHome;

  homeTab.classList.toggle(
    "active",
    isHome
  );

  drivesTab.classList.toggle(
    "active",
    !isHome
  );

  if (isHome) {
    setTimeout(() => {
      map.invalidateSize();
    }, 50);
  }

  if (
    !isHome &&
    historyMap
  ) {
    setTimeout(() => {
      historyMap.invalidateSize();
    }, 50);
  }

  updateOverallStats();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* =========================================================
   START DRIVE
   ========================================================= */

function startDrive() {
  if (
    !navigator.geolocation
  ) {
    gpsMessage.textContent =
      "GPS is not supported by this browser.";

    return;
  }

  driving = true;

  startTime =
    Date.now();

  selectedDriveId =
    null;

  totalDistance =
    0;

  topSpeed =
    0;

  speedSamples =
    [];

  routePoints =
    [];

  lastPosition =
    null;

  movingTime =
    0;

  stoppedTime =
    0;

  lastTimeSample =
    startTime;

  currentlyMoving =
    false;

  /* Reset GPS filtering state */
  movementConfirmations =
    0;

  stoppedConfirmations =
    0;

  filteredSpeed =
    0;

  recentSpeedSamples =
    [];

  clearHomeMap();

  speedDisplay.textContent =
    "0";

  durationDisplay.textContent =
    "00:00:00";

  distanceDisplay.textContent =
    "0.00 km";

  topSpeedDisplay.textContent =
    "0 km/h";

  averageSpeedDisplay.textContent =
    "0 km/h";

  movingTimeDisplay.textContent =
    "00:00:00";

  stoppedTimeDisplay.textContent =
    "00:00:00";

  startButton.textContent =
    "STOP DRIVE";

  startButton.classList.add(
    "stop"
  );

  driveState.textContent =
    "Waiting for GPS...";

  gpsMessage.textContent =
    "Getting your location...";

  statusDot.classList.add(
    "active"
  );

  timer =
    setInterval(
      () => {
        const elapsed =
          Date.now() -
          startTime;

        durationDisplay.textContent =
          formatDuration(
            elapsed
          );

        const average =
          calculateCurrentAverageSpeed();

        averageSpeedDisplay.textContent =
          `${Math.round(
            average
          )} km/h`;

        movingTimeDisplay.textContent =
          formatDuration(
            getLiveMovingTime()
          );

        stoppedTimeDisplay.textContent =
          formatDuration(
            getLiveStoppedTime()
          );
      },
      1000
    );

    if (
    Capacitor.isNativePlatform()
  ) {
    nativeLocationActive =
      true;

    BackgroundGeolocation.start(
      {
        backgroundMessage:
          "Drive Tracker is recording your location.",

        backgroundTitle:
          "Drive Tracker",

        requestPermissions:
          true,

        stale:
          false,

        distanceFilter:
          0,
      },
      (
        location,
        error
      ) => {
        if (error) {
          console.error(
            "Background GPS error:",
            error
          );

          handleLocationError({
            code: 2,
            message:
              error.message ||
              "Background GPS error",
          });

          return;
        }

        if (!location) {
          return;
        }

        handlePosition({
          coords: {
            latitude:
              location.latitude,

            longitude:
              location.longitude,

            accuracy:
              location.accuracy,

            speed:
              location.speed,
          },

          timestamp:
            location.time ||
            Date.now(),
        });
      }
    );
  } else {
    watchId =
      navigator.geolocation.watchPosition(
        handlePosition,
        handleLocationError,
        {
          enableHighAccuracy:
            true,

          maximumAge:
            1000,

          timeout:
            10000,
        }
      );
  }
}

/* =========================================================
   START / STOP BUTTON
   ========================================================= */

startButton.addEventListener(
  "click",
  () => {
    if (driving) {
      stopDrive();
    } else {
      startDrive();
    }
  }
);

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function getSavedDrives() {
  try {
    const saved =
      localStorage.getItem(
        "driveHistory"
      );

    if (!saved) {
      return [];
    }

    const drives =
      JSON.parse(
        saved
      );

    return Array.isArray(
      drives
    )
      ? drives
      : [];
  } catch (
    error
  ) {
    console.error(
      "Could not read drive history:",
      error
    );

    return [];
  }
}/* =========================================================
   GPS POSITION HANDLER
   ========================================================= */

function handlePosition(position) {
  if (!driving) return;

  const now =
    Date.now();

  const latitude =
    position.coords.latitude;

  const longitude =
    position.coords.longitude;

  let rawSpeed =
    Number(
      position.coords.speed
    );

  if (
    !Number.isFinite(
      rawSpeed
    ) ||
    rawSpeed < 0
  ) {
    rawSpeed = 0;
  }

  rawSpeed *= 3.6;

  if (
    rawSpeed >
    MAX_ACCEPTED_SPEED_KMH
  ) {
    rawSpeed =
      MAX_ACCEPTED_SPEED_KMH;
  }

  const accuracy =
    Number(
      position.coords.accuracy
    ) || 0;

  /*
   * Keep a short history of GPS speed readings.
   * This helps eliminate occasional GPS spikes.
   */
  recentSpeedSamples.push(
    rawSpeed
  );

  if (
    recentSpeedSamples.length >
    3
  ) {
    recentSpeedSamples.shift();
  }

  const sortedSpeeds =
    [...recentSpeedSamples].sort(
      (a, b) =>
        a - b
    );

  const middleIndex =
    Math.floor(
      sortedSpeeds.length /
        2
    );

  const medianSpeed =
    sortedSpeeds[
      middleIndex
    ];

  /*
   * Require several consecutive GPS readings
   * before changing between stopped and moving.
   */
  if (
    medianSpeed >=
    MOVING_CONFIRMATION_THRESHOLD_KMH
  ) {
    movementConfirmations++;
    stoppedConfirmations =
      0;
  } else {
    stoppedConfirmations++;
    movementConfirmations =
      0;
  }

  if (
    movementConfirmations >=
    MOVING_CONFIRMATIONS_REQUIRED
  ) {
    currentlyMoving =
      true;
  }

  if (
    stoppedConfirmations >=
    STOPPED_CONFIRMATIONS_REQUIRED
  ) {
    currentlyMoving =
      false;
  }

  /*
   * When the vehicle is considered stopped,
   * force displayed speed to exactly 0.
   */
  if (
    !currentlyMoving
  ) {
    filteredSpeed =
      0;
  } else {
    filteredSpeed =
      medianSpeed;
  }

  const speed =
    Math.max(
      0,
      Math.min(
        MAX_ACCEPTED_SPEED_KMH,
        filteredSpeed
      )
    );

  const point = {
    latitude,
    longitude,
    speed,
    timestamp:
      now,
    accuracy,
  };

  updateMotionTime(
    now,
    currentlyMoving
  );

  /*
   * Calculate distance only when movement has
   * been positively confirmed.
   *
   * Very small GPS movements are ignored because
   * they are usually GPS drift while stationary.
   */
  if (
    lastPosition &&
    currentlyMoving
  ) {
    const distance =
      calculateDistance(
        lastPosition.latitude,
        lastPosition.longitude,
        latitude,
        longitude
      );

    const timeDifference =
      Math.max(
        1,
        now -
          lastPosition.timestamp
      );

    const maximumReasonableDistance =
      Math.max(
        0.05,
        (Math.max(
          speed,
          5
        ) /
          3600) *
          (timeDifference /
            1000) *
          3
      );

    if (
      distance >=
        STATIONARY_DRIFT_METERS /
          1000 &&
      distance <=
        maximumReasonableDistance
    ) {
      totalDistance +=
        distance;
    }
  }

  /*
   * Keep the latest GPS point for the next
   * distance calculation.
   */
  lastPosition = {
    latitude,
    longitude,
    timestamp:
      now,
  };

  if (
    speed >
    topSpeed
  ) {
    topSpeed =
      speed;
  }

  speedSamples.push({
    speed,
    timestamp:
      now,
  });

  routePoints.push(
    point
  );

  /* =======================================================
     UPDATE LIVE HOME DISPLAY
     ======================================================= */

  speedDisplay.textContent =
    Math.round(
      speed
    );

  distanceDisplay.textContent =
    `${totalDistance.toFixed(
      2
    )} km`;

  topSpeedDisplay.textContent =
    `${Math.round(
      topSpeed
    )} km/h`;

  const average =
    calculateCurrentAverageSpeed();

  averageSpeedDisplay.textContent =
    `${Math.round(
      average
    )} km/h`;

  movingTimeDisplay.textContent =
    formatDuration(
      getLiveMovingTime()
    );

  stoppedTimeDisplay.textContent =
    formatDuration(
      getLiveStoppedTime()
    );

  driveState.textContent =
    currentlyMoving
      ? "Driving"
      : "Stopped";

  if (
    accuracy > 0
  ) {
    gpsMessage.textContent =
      `GPS accuracy: ±${Math.round(
        accuracy
      )} m`;
  } else {
    gpsMessage.textContent =
      "GPS accuracy unavailable";
  }

  updateLiveLocationMarker(
    latitude,
    longitude
  );

  /* =======================================================
     DRAW SPEED-COLORED ROUTE
     ======================================================= */

  if (
    routePoints.length >=
    2
  ) {
    const previous =
      routePoints[
        routePoints.length -
          2
      ];

    const segment =
      L.polyline(
        [
          [
            previous.latitude,
            previous.longitude,
          ],
          [
            latitude,
            longitude,
          ],
        ],
        {
          color:
            getSpeedColor(
              speed
            ),
          weight: 5,
          opacity: 1,
          lineJoin:
            "round",
          lineCap:
            "round",
        }
      ).addTo(
        map
      );

    homeRouteSegments.push(
      segment
    );
  }

  /*
   * Center the map on the first GPS fix,
   * then gently follow the vehicle for the
   * first few points.
   */
  if (
    routePoints.length ===
    1
  ) {
    map.setView(
      [
        latitude,
        longitude,
      ],
      16,
      {
        animate:
          true,
      }
    );
  } else if (
    routePoints.length <=
    5
  ) {
    map.panTo(
      [
        latitude,
        longitude,
      ],
      {
        animate:
          true,
        duration:
          0.5,
      }
    );
  }
}

/* =========================================================
   GPS ERROR HANDLER
   ========================================================= */

function handleLocationError(
  error
) {
  console.error(
    "GPS error:",
    error
  );

  if (
    !driving
  ) {
    return;
  }

  let message =
    "Unable to get GPS location.";

  if (
    error &&
    error.code ===
      1
  ) {
    message =
      "Location permission denied. Please allow location access for Safari.";
  } else if (
    error &&
    error.code ===
      2
  ) {
    message =
      "GPS location unavailable. Try moving somewhere with a clearer view of the sky.";
  } else if (
    error &&
    error.code ===
      3
  ) {
    message =
      "GPS request timed out. Waiting for another location update...";
  }

  gpsMessage.textContent =
    message;
}

/* =========================================================
   STOP DRIVE
   ========================================================= */

async function stopDrive() {
  if (
    !driving
  ) {
    return;
  }

  const endTime =
    Date.now();

  /*
   * Add the final section of moving/stopped time.
   */
  if (
    lastTimeSample
  ) {
    const elapsed =
      Math.max(
        0,
        endTime -
          lastTimeSample
      );

    if (
      currentlyMoving
    ) {
      movingTime +=
        elapsed;
    } else {
      stoppedTime +=
        elapsed;
    }
  }

  if (
    timer
  ) {
    clearInterval(
      timer
    );

    timer =
      null;
  }

    if (
    nativeLocationActive
  ) {
    await BackgroundGeolocation.stop();

    nativeLocationActive =
      false;
  }

  if (
    watchId !== null
  ) {
    navigator.geolocation.clearWatch(
      watchId
    );

    watchId =
      null;
  }

  driving =
    false;

  statusDot.classList.remove(
    "active"
  );

  startButton.textContent =
    "START DRIVE";

  startButton.classList.remove(
    "stop"
  );

  driveState.textContent =
    "Drive completed";

  const duration =
    endTime -
    startTime;

  const averageSpeed =
    totalDistance > 0 &&
    duration > 0
      ? totalDistance /
        (duration /
          3600000)
      : 0;

  const drive = {
    id:
      Date.now().toString(),

    startTime:
      startTime,

    endTime:
      endTime,

    duration:
      duration,

    distance:
      totalDistance,

    topSpeed:
      topSpeed,

    averageSpeed:
      averageSpeed,

    movingTime:
      movingTime,

    stoppedTime:
      stoppedTime,

    route:
      routePoints,
  };

  saveDrive(
    drive
  );

  /*
   * Reset GPS filtering state so the next drive
   * starts completely clean.
   */
  movementConfirmations =
    0;

  stoppedConfirmations =
    0;

  filteredSpeed =
    0;

  recentSpeedSamples =
    [];

  lastPosition =
    null;

  lastTimeSample =
    null;

  currentlyMoving =
    false;

  renderHistory();

  updateOverallStats();

  /*
   * Leave the completed route visible on the
   * Home page until the next drive is started.
   */
}

/* =========================================================
   SAVE DRIVE
   ========================================================= */

function saveDrive(
  drive
) {
  const drives =
    getSavedDrives();

  drives.unshift(
    drive
  );

  try {
    localStorage.setItem(
      "driveHistory",
      JSON.stringify(
        drives
      )
    );
  } catch (
    error
  ) {
    console.error(
      "Could not save drive:",
      error
    );
  }
}

/* =========================================================
   DELETE DRIVE
   ========================================================= */

function deleteDrive(
  driveId
) {
  const drives =
    getSavedDrives();

  const updated =
    drives.filter(
      (drive) =>
        String(
          drive.id
        ) !==
        String(
          driveId
        )
    );

  try {
    localStorage.setItem(
      "driveHistory",
      JSON.stringify(
        updated
      )
    );
  } catch (
    error
  ) {
    console.error(
      "Could not delete drive:",
      error
    );
  }

  if (
    String(
      selectedDriveId
    ) ===
    String(
      driveId
    )
  ) {
    selectedDriveId =
      null;
  }

  renderHistory();

  updateOverallStats();
}

/* =========================================================
   LOCATION / REVERSE GEOCODING
   ========================================================= */

async function reverseGeocode(
  latitude,
  longitude
) {
  try {
    const response =
      await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          latitude
        )}&lon=${encodeURIComponent(
          longitude
        )}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept:
              "application/json",
          },
        }
      );

    if (
      !response.ok
    ) {
      return "";
    }

    const data =
      await response.json();

    if (
      data &&
      data.display_name
    ) {
      return data.display_name;
    }

    return "";
  } catch (
    error
  ) {
    console.error(
      "Reverse geocoding failed:",
      error
    );

    return "";
  }
}

async function updateHistoryLocations() {
  if (
    historyLocationUpdateInProgress
  ) {
    return;
  }

  historyLocationUpdateInProgress =
    true;

  const drives =
    getSavedDrives();

  let changed =
    false;

  try {
    for (
      const drive of drives
    ) {
      if (
        !Array.isArray(
          drive.route
        ) ||
        drive.route.length ===
          0
      ) {
        continue;
      }

      const first =
        drive.route[0];

      const last =
        drive.route[
          drive.route.length -
            1
        ];

      if (
        !drive.startLocation
      ) {
        const location =
          await reverseGeocode(
            first.latitude,
            first.longitude
          );

        if (
          location
        ) {
          drive.startLocation =
            location;

          changed =
            true;
        }
      }

      if (
        !drive.endLocation
      ) {
        const location =
          await reverseGeocode(
            last.latitude,
            last.longitude
          );

        if (
          location
        ) {
          drive.endLocation =
            location;

          changed =
            true;
        }
      }
    }

    if (
      changed
    ) {
      localStorage.setItem(
        "driveHistory",
        JSON.stringify(
          drives
        )
      );
    }
  } catch (
    error
  ) {
    console.error(
      "Could not update locations:",
      error
    );
  } finally {
    historyLocationUpdateInProgress =
      false;
  }

  if (
    changed
  ) {
    renderHistory();
  }
}

/* =========================================================
   RENDER DRIVE HISTORY
   ========================================================= */

function renderHistory() {
  const drives =
    getSavedDrives();

  driveCount.textContent =
    `${drives.length} ${
      drives.length === 1
        ? "drive"
        : "drives"
    }`;

  if (
    drives.length === 0
  ) {
    historyElement.className =
      "history-empty";

    historyElement.innerHTML = `
      <div class="empty-history-icon">
        🚗
      </div>

      <p>
        No completed drives yet.
      </p>

      <span>
        Start a drive from the Home tab
        and your trips will appear here.
      </span>
    `;

    destroyHistoryMap();

    return;
  }

  historyElement.className =
    "history-list";

  historyElement.innerHTML =
    drives
      .map(
        (drive) => {
          const isExpanded =
            String(
              selectedDriveId
            ) ===
            String(
              drive.id
            );

          const route =
            Array.isArray(
              drive.route
            )
              ? drive.route
              : [];

          const firstPoint =
            route[0];

          const lastPoint =
            route[
              route.length - 1
            ];

          const startLocation =
            drive.startLocation ||
            drive.startLocationName;

          const endLocation =
            drive.endLocation ||
            drive.endLocationName;

          const moving =
            Number(
              drive.movingTime
            ) || 0;

          const stopped =
            Number(
              drive.stoppedTime
            ) || 0;

          const average =
            Number(
              drive.averageSpeed
            ) || 0;

          const top =
            Number(
              drive.topSpeed
            ) || 0;

          const distance =
            Number(
              drive.distance
            ) || 0;

          const duration =
            Number(
              drive.duration
            ) || 0;

          const date =
            drive.startTime
              ? formatDate(
                  drive.startTime
                )
              : "Unknown date";

          const time =
            drive.startTime
              ? formatTime(
                  drive.startTime
                )
              : "--";

          const endTime =
            drive.endTime
              ? formatTime(
                  drive.endTime
                )
              : "--";

          const startName =
            startLocation
              ? locationText(
                  startLocation
                )
              : firstPoint
              ? "Loading start location..."
              : "Start unavailable";

          const finishName =
            endLocation
              ? locationText(
                  endLocation
                )
              : lastPoint
              ? "Loading finish location..."
              : "Finish unavailable";

          return `
            <article
              class="history-item ${
                isExpanded
                  ? "expanded"
                  : ""
              }"
              data-drive-id="${escapeHtml(
                String(
                  drive.id
                )
              )}"
            >

              <button
                type="button"
                class="history-summary"
                data-history-toggle="${escapeHtml(
                  String(
                    drive.id
                  )
                )}"
              >

                <div class="history-summary-left">

                  <div class="history-date-time">

                    <span class="history-date">
                      ${escapeHtml(
                        date
                      )}
                    </span>

                    <span class="history-time">
                      ${escapeHtml(
                        time
                      )}
                    </span>

                  </div>

                  <div class="history-locations">

                    <div
                      class="history-start-location"
                    >
                      ${escapeHtml(
                        `Start: ${startName}`
                      )}
                    </div>

                    <div
                      class="history-end-location"
                    >
                      ${escapeHtml(
                        `Finish: ${finishName}`
                      )}
                    </div>

                  </div>

                </div>

                <div class="history-summary-right">

                  <strong>
                    ${distance.toFixed(
                      2
                    )} km
                  </strong>

                  <span class="history-chevron">
                    ${
                      isExpanded
                        ? "⌃"
                        : "⌄"
                    }
                  </span>

                </div>

              </button>

              ${
                isExpanded
                  ? `
                    <div class="history-expanded">

                      <div
                        class="history-drive-map"
                        id="history-map-${escapeHtml(
                          String(
                            drive.id
                          )
                        )}"
                      ></div>

                      <div
                        class="history-speed-chart-container"
                      >

                        <div class="chart-heading">

                          <span>
                            Speed
                          </span>

                          <span>
                            Max ${Math.round(
                              top
                            )} km/h
                          </span>

                        </div>

                        <div
                          role="img"
                          aria-label="Speed chart"
                          class="history-speed-chart"
                          id="history-chart-${escapeHtml(
                            String(
                              drive.id
                            )
                          )}"
                        ></div>

                      </div>

                      <div class="history-details">

                        <div class="history-detail">
                          <span>
                            Date
                          </span>

                          <strong>
                            ${escapeHtml(
                              date
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Started
                          </span>

                          <strong>
                            ${escapeHtml(
                              time
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Finished
                          </span>

                          <strong>
                            ${escapeHtml(
                              endTime
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Distance
                          </span>

                          <strong>
                            ${distance.toFixed(
                              2
                            )} km
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Duration
                          </span>

                          <strong>
                            ${formatDuration(
                              duration
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Average speed
                          </span>

                          <strong>
                            ${Math.round(
                              average
                            )} km/h
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Top speed
                          </span>

                          <strong>
                            ${Math.round(
                              top
                            )} km/h
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Moving time
                          </span>

                          <strong>
                            ${formatDuration(
                              moving
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            Stopped time
                          </span>

                          <strong>
                            ${formatDuration(
                              stopped
                            )}
                          </strong>
                        </div>

                        <div class="history-detail">
                          <span>
                            GPS points
                          </span>

                          <strong>
                            ${route.length}
                          </strong>
                        </div>

                      </div>

                      <div class="history-route-summary">

                        <div>
                          <span>
                            START
                          </span>

                          <strong
                            class="history-detail-start-place"
                          >
                            ${escapeHtml(
                              startName
                            )}
                          </strong>
                        </div>

                        <div class="route-arrow">
                          →
                        </div>

                        <div>
                          <span>
                            FINISH
                          </span>

                          <strong
                            class="history-detail-finish-place"
                          >
                            ${escapeHtml(
                              finishName
                            )}
                          </strong>
                        </div>

                      </div>

                      <button
                        type="button"
                        class="delete-drive-button"
                        data-delete-drive="${escapeHtml(
                          String(
                            drive.id
                          )
                        )}"
                      >
                        Delete Drive
                      </button>

                    </div>
                  `
                  : ""
              }

            </article>
          `;
        }
      )
      .join("");

  historyElement
    .querySelectorAll(
      "[data-history-toggle]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const driveId =
              button.dataset
                .historyToggle;

            toggleHistoryDrive(
              driveId
            );
          }
        );
      }
    );

  historyElement
    .querySelectorAll(
      "[data-delete-drive]"
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          (event) => {
            event.stopPropagation();

            const driveId =
              button.dataset
                .deleteDrive;

            const confirmed =
              window.confirm(
                "Delete this drive permanently?"
              );

            if (
              confirmed
            ) {
              deleteDrive(
                driveId
              );
            }
          }
        );
      }
    );

  void updateHistoryLocations();

  if (
    selectedDriveId !==
    null
  ) {
    const selectedDrive =
      drives.find(
        (drive) =>
          String(
            drive.id
          ) ===
          String(
            selectedDriveId
          )
      );

    const selectedItem =
      historyElement.querySelector(
        `[data-drive-id="${CSS.escape(
          String(
            selectedDriveId
          )
        )}"]`
      );

    if (
  selectedDrive &&
  selectedItem
) {
  showDriveInsideHistory(
    selectedDrive.id,
    false
  );
}
  }
}

/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHtml(
  value
) {
  return String(
    value
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

/* =========================================================
   TOGGLE HISTORY DRIVE
   ========================================================= */

function toggleHistoryDrive(driveId) {
  const drives = getSavedDrives();

  const drive = drives.find(
    (item) =>
      String(item.id) === String(driveId)
  );

  if (!drive) {
    return;
  }

  if (
    String(selectedDriveId) ===
    String(driveId)
  ) {
    selectedDriveId = null;
  } else {
    selectedDriveId = drive.id;
  }

  renderHistory();
}

/* =========================================================
   DESTROY HISTORY MAP
   ========================================================= */

function destroyHistoryMap() {
  if (
    historyMap
  ) {
    historyMap.remove();

    historyMap =
      null;
  }
}

/* =========================================================
   SHOW SELECTED DRIVE
   ========================================================= */

function showDriveInsideHistory(
  driveId,
  fullscreen = false
) {
  const drives =
    getSavedDrives();

  const drive =
    drives.find(
      (item) =>
        String(
          item.id
        ) ===
        String(
          driveId
        )
    );

  if (!drive) {
    return;
  }

  if (
    fullscreen
  ) {
    showFullscreenDriveMap(
      drive
    );

    return;
  }

  const mapElement =
    document.getElementById(
      `history-map-${drive.id}`
    );

  if (!mapElement) {
    return;
  }

  destroyHistoryMap();

  historyMap =
    L.map(
      mapElement,
      {
        zoomControl:
          true,
        attributionControl:
          true,
      }
    );

    mapElement.addEventListener(
  "click",
  () => {
    showFullscreenDriveMap(
      drive
    );
  }
);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom:
        19,
      attribution:
        "&copy; OpenStreetMap contributors",
    }
  ).addTo(
    historyMap
  );

  const route =
    Array.isArray(
      drive.route
    )
      ? drive.route
      : [];

  if (
    route.length ===
    0
  ) {
    drawHistorySpeedChart(
      drive
    );

    historyMap.setView(
      [
        0,
        0,
      ],
      2
    );

    return;
  }

  const bounds =
    L.latLngBounds();

  for (
    let i = 1;
    i < route.length;
    i++
  ) {
    const previous =
      route[i - 1];

    const current =
      route[i];

    const segment =
      L.polyline(
        [
          [
            previous.latitude,
            previous.longitude,
          ],
          [
            current.latitude,
            current.longitude,
          ],
        ],
        {
          color:
            getSpeedColor(
              current.speed
            ),
          weight: 5,
          opacity: 1,
          lineJoin:
            "round",
          lineCap:
            "round",
        }
      ).addTo(
        historyMap
      );

    bounds.extend(
      [
        previous.latitude,
        previous.longitude,
      ]
    );

    bounds.extend(
      [
        current.latitude,
        current.longitude,
      ]
    );
  }

  if (
    route.length ===
    1
  ) {
    bounds.extend(
      [
        route[0].latitude,
        route[0].longitude,
      ]
    );
  }

  L.marker(
    [
      route[0].latitude,
      route[0].longitude,
    ],
    {
      icon:
        startLocationIcon,
    }
  )
    .addTo(
      historyMap
    )
    .bindPopup(
      "Start"
    );

  const last =
    route[
      route.length -
        1
    ];

  L.marker(
    [
      last.latitude,
      last.longitude,
    ],
    {
      icon:
        finishLocationIcon,
    }
  )
    .addTo(
      historyMap
    )
    .bindPopup(
      "Finish"
    );

  if (
    bounds.isValid()
  ) {
    historyMap.fitBounds(
      bounds,
      {
        padding: [
          20,
          20,
        ],
      }
    );
  }

  drawHistorySpeedChart(
    drive
  );

  setTimeout(
    () => {
      if (
        historyMap
      ) {
        historyMap.invalidateSize();
      }
    },
    100
  );
}

/* =========================================================
   HISTORY SPEED CHART
   ========================================================= */

function drawHistorySpeedChart(
  drive
) {
  const chart =
    document.getElementById(
      `history-chart-${drive.id}`
    );

  if (!chart) {
    return;
  }

  chart.innerHTML =
    "";

  const route =
    Array.isArray(
      drive.route
    )
      ? drive.route
      : [];

  if (
    route.length ===
    0
  ) {
    const message =
      document.createElement(
        "p"
      );

    message.className =
      "history-chart-empty";

    message.textContent =
      "No GPS samples were saved for this drive.";

    chart.appendChild(
      message
    );

    return;
  }

  const width =
    Math.max(
      300,
      chart.clientWidth ||
        300
    );

  const height =
    150;

  const paddingLeft =
    38;

  const paddingRight =
    12;

  const paddingTop =
    12;

  const paddingBottom =
    28;

  const graphWidth =
    width -
    paddingLeft -
    paddingRight;

  const graphHeight =
    height -
    paddingTop -
    paddingBottom;

  const speeds =
    route.map(
      (point) =>
        Number(
          point.speed
        ) || 0
    );

  const maxSpeed =
    Math.max(
      10,
      ...speeds
    );

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.setAttribute(
    "viewBox",
    `0 0 ${width} ${height}`
  );

  svg.setAttribute(
    "width",
    "100%"
  );

  svg.setAttribute(
    "height",
    String(
      height
    )
  );

  svg.classList.add(
    "speed-chart-svg"
  );

  /*
   * Horizontal guide lines.
   */
  const gridCount =
    4;

  for (
    let i = 0;
    i <= gridCount;
    i++
  ) {
    const y =
      paddingTop +
      graphHeight -
      (graphHeight *
        i) /
        gridCount;

    const line =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

    line.setAttribute(
      "x1",
      String(
        paddingLeft
      )
    );

    line.setAttribute(
      "x2",
      String(
        width -
          paddingRight
      )
    );

    line.setAttribute(
      "y1",
      String(y)
    );

    line.setAttribute(
      "y2",
      String(y)
    );

    line.setAttribute(
      "class",
      "chart-grid-line"
    );

    svg.appendChild(
      line
    );

    const label =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    label.setAttribute(
      "x",
      String(
        paddingLeft -
          7
      )
    );

    label.setAttribute(
      "y",
      String(
        y + 4
      )
    );

    label.setAttribute(
      "text-anchor",
      "end"
    );

    label.setAttribute(
      "class",
      "chart-axis-label"
    );

    label.textContent =
      Math.round(
        (maxSpeed *
          i) /
          gridCount
      );

    svg.appendChild(
      label
    );
  }

  /*
   * Add a little space below the 0 km/h line.
   */
  const chartBottom =
    paddingTop +
    graphHeight;
  /*
   * Draw X and Y axes.
   */

  const yAxis =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

  yAxis.setAttribute(
    "x1",
    String(paddingLeft)
  );

  yAxis.setAttribute(
    "x2",
    String(paddingLeft)
  );

  yAxis.setAttribute(
    "y1",
    String(paddingTop)
  );

  yAxis.setAttribute(
    "y2",
    String(chartBottom)
  );

  yAxis.setAttribute(
    "stroke",
    "rgba(255,255,255,0.45)"
  );

  yAxis.setAttribute(
    "stroke-width",
    "1.5"
  );

  svg.appendChild(yAxis);

  const xAxis =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

  xAxis.setAttribute(
    "x1",
    String(paddingLeft)
  );

  xAxis.setAttribute(
    "x2",
    String(width - paddingRight)
  );

  xAxis.setAttribute(
    "y1",
    String(chartBottom)
  );

  xAxis.setAttribute(
    "y2",
    String(chartBottom)
  );

  xAxis.setAttribute(
    "stroke",
    "rgba(255,255,255,0.45)"
  );

  xAxis.setAttribute(
    "stroke-width",
    "1.5"
  );

  svg.appendChild(xAxis);
  const points =
    route.map(
      (point, index) => {
        const x =
          route.length <= 1
            ? paddingLeft
            : paddingLeft +
              (graphWidth *
                index) /
                (route.length -
                  1);

        const speed =
          Number(
            point.speed
          ) || 0;

        const y =
          paddingTop +
          graphHeight -
          (speed /
            maxSpeed) *
            graphHeight;

        return {
          x,
          y,
          speed,
        };
      }
    );

  /*
 * Draw the speed line as one continuous path.
 * The gradient blends smoothly between speed colors.
 */
const gradient =
  document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );

gradient.setAttribute(
  "id",
  `speed-gradient-${drive.id}`
);

gradient.setAttribute(
  "x1",
  "0%"
);

gradient.setAttribute(
  "x2",
  "100%"
);

gradient.setAttribute(
  "y1",
  "0%"
);

gradient.setAttribute(
  "y2",
  "0%"
);

const colorStops = [
  {
    speed: 0,
    color: "#0a84ff",
  },
  {
    speed: 10,
    color: "#30d158",
  },
  {
    speed: 40,
    color: "#ffe600",
  },
  {
    speed: 70,
    color: "#ff9f0a",
  },
  {
    speed: 100,
    color: "#ff453a",
  },
];

colorStops.forEach(
  (stop) => {
    const gradientStop =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );

    gradientStop.setAttribute(
      "offset",
      `${Math.min(
        100,
        (stop.speed /
          maxSpeed) *
          100
      )}%`
    );

    gradientStop.setAttribute(
      "stop-color",
      stop.color
    );

    gradient.appendChild(
      gradientStop
    );
  }
);

const defs =
  document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs"
  );

defs.appendChild(
  gradient
);

svg.appendChild(
  defs
);

const speedPath =
  document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );

speedPath.setAttribute(
  "points",
  points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ")
);

speedPath.setAttribute(
  "fill",
  "none"
);

speedPath.setAttribute(
  "stroke",
  `url(#speed-gradient-${drive.id})`
);

speedPath.setAttribute(
  "stroke-width",
  "3"
);

speedPath.setAttribute(
  "stroke-linecap",
  "round"
);

speedPath.setAttribute(
  "stroke-linejoin",
  "round"
);

svg.appendChild(
  speedPath
);


  /*
   * Time labels.
   */
  if (
    route.length > 0
  ) {
    const first =
      route[0];

    const lastPoint =
      route[
        route.length -
          1
      ];

    const firstLabel =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    firstLabel.setAttribute(
      "x",
      String(
        paddingLeft
      )
    );

    firstLabel.setAttribute(
      "y",
      String(
        height -
          7
      )
    );

    firstLabel.setAttribute(
      "text-anchor",
      "start"
    );

    firstLabel.setAttribute(
      "class",
      "chart-axis-label"
    );

    const firstTimestamp =
      Number(
        first.timestamp
      ) ||
      Number(
        drive.startTime
      ) ||
      0;

    const lastTimestamp =
      Number(
        lastPoint.timestamp
      ) ||
      Number(
        drive.endTime
      ) ||
      firstTimestamp;

    firstLabel.textContent =
      formatChartTime(
        firstTimestamp,
        firstTimestamp
      );

    svg.appendChild(
      firstLabel
    );

    const lastLabel =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    lastLabel.setAttribute(
      "x",
      String(
        width -
          paddingRight
      )
    );

    lastLabel.setAttribute(
      "y",
      String(
        height -
          7
      )
    );

    lastLabel.setAttribute(
      "text-anchor",
      "end"
    );

    lastLabel.setAttribute(
      "class",
      "chart-axis-label"
    );

    lastLabel.textContent =
      formatChartTime(
        lastTimestamp,
        firstTimestamp
      );

    svg.appendChild(
      lastLabel
    );
  }

  chart.appendChild(
    svg
  );
}

/* =========================================================
   CHART TIME FORMAT
   ========================================================= */



/* =========================================================
   HISTORY CHART RESIZE
   ========================================================= */

function updateHistoryChartsOnResize() {
  if (
    !selectedDriveId
  ) {
    return;
  }

  const drives =
    getSavedDrives();

  const drive =
    drives.find(
      (item) =>
        String(
          item.id
        ) ===
        String(
          selectedDriveId
        )
    );

  if (
    drive
  ) {
    drawHistorySpeedChart(
      drive
    );
  }
}

window.addEventListener(
  "resize",
  () => {
    updateHistoryChartsOnResize();

    if (
      historyMap
    ) {
      historyMap.invalidateSize();
    }

    if (
      currentTab ===
      "home"
    ) {
      map.invalidateSize();
    }
  }
);

/* =========================================================
   INITIAL HISTORY RENDER
   ========================================================= */

renderHistory();

updateOverallStats();

/*
 * Try to obtain readable start/end locations
 * for saved drives. This runs in the background
 * and does not prevent the app from starting.
 */
updateHistoryLocations();/* =========================================================
   FULL-SCREEN DRIVE MAP
   ========================================================= */

function showFullscreenDriveMap(
  drive
) {
  const route =
    Array.isArray(
      drive.route
    )
      ? drive.route
      : [];

  if (
    route.length === 0
  ) {
    return;
  }

  const overlay =
    document.createElement(
      "div"
    );

  overlay.className =
    "fullscreen-map-overlay";

  overlay.innerHTML = `
    <div class="fullscreen-map-header">
      <div>
        <strong>Drive Route</strong>
      </div>

      <button
        type="button"
        class="fullscreen-map-close"
        aria-label="Close map"
      >
        ×
      </button>
    </div>

    <div
      class="fullscreen-drive-map"
      id="fullscreen-drive-map"
    ></div>
  `;

  document.body.appendChild(
    overlay
  );

  const closeButton =
    overlay.querySelector(
      ".fullscreen-map-close"
    );

  closeButton.addEventListener(
    "click",
    () => {
      overlay.remove();
    }
  );

  const fullMapElement =
    overlay.querySelector(
      "#fullscreen-drive-map"
    );

  const fullMap =
    L.map(
      fullMapElement,
      {
        zoomControl:
          true,
        attributionControl:
          true,
      }
    );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom:
        19,
      attribution:
        "&copy; OpenStreetMap contributors",
    }
  ).addTo(
    fullMap
  );

  const bounds =
    L.latLngBounds();

  for (
    let i = 1;
    i < route.length;
    i++
  ) {
    const previous =
      route[i - 1];

    const current =
      route[i];

    L.polyline(
      [
        [
          previous.latitude,
          previous.longitude,
        ],
        [
          current.latitude,
          current.longitude,
        ],
      ],
      {
        color:
          getSpeedColor(
            current.speed
          ),
        weight: 6,
        opacity: 1,
        lineJoin:
          "round",
        lineCap:
          "round",
      }
    ).addTo(
      fullMap
    );

    bounds.extend(
      [
        previous.latitude,
        previous.longitude,
      ]
    );

    bounds.extend(
      [
        current.latitude,
        current.longitude,
      ]
    );
  }

  if (
    route.length === 1
  ) {
    bounds.extend(
      [
        route[0].latitude,
        route[0].longitude,
      ]
    );
  }

  L.marker(
    [
      route[0].latitude,
      route[0].longitude,
    ],
    {
      icon:
        startLocationIcon,
    }
  )
    .addTo(
      fullMap
    )
    .bindPopup(
      "Start"
    );

  const finish =
    route[
      route.length -
        1
    ];

  L.marker(
    [
      finish.latitude,
      finish.longitude,
    ],
    {
      icon:
        finishLocationIcon,
    }
  )
    .addTo(
      fullMap
    )
    .bindPopup(
      "Finish"
    );

  if (
    bounds.isValid()
  ) {
    fullMap.fitBounds(
      bounds,
      {
        padding: [
          30,
          30,
        ],
      }
    );
  }

  setTimeout(
    () => {
      fullMap.invalidateSize();
    },
    100
  );
}

/* =========================================================
   RESTORE A SAVED DRIVE ON THE HOME MAP
   ========================================================= */

function initializeSavedDriveOnHome() {
  if (
    driving
  ) {
    return;
  }

  const drives =
    getSavedDrives();

  if (
    drives.length === 0
  ) {
    return;
  }

  const latestDrive =
    drives[0];

  if (
    !latestDrive ||
    !Array.isArray(
      latestDrive.route
    ) ||
    latestDrive.route.length ===
      0
  ) {
    return;
  }

  clearHomeMap();

  const route =
    latestDrive.route;

  const bounds =
    L.latLngBounds();

  for (
    let i = 1;
    i < route.length;
    i++
  ) {
    const previous =
      route[i - 1];

    const current =
      route[i];

    const segment =
      L.polyline(
        [
          [
            previous.latitude,
            previous.longitude,
          ],
          [
            current.latitude,
            current.longitude,
          ],
        ],
        {
          color:
            getSpeedColor(
              current.speed
            ),
          weight: 5,
          opacity: 1,
          lineJoin:
            "round",
          lineCap:
            "round",
        }
      ).addTo(
        map
      );

    homeRouteSegments.push(
      segment
    );

    bounds.extend(
      [
        previous.latitude,
        previous.longitude,
      ]
    );

    bounds.extend(
      [
        current.latitude,
        current.longitude,
      ]
    );
  }

  if (
    route.length === 1
  ) {
    bounds.extend(
      [
        route[0].latitude,
        route[0].longitude,
      ]
    );
  }

  homeStartMarker =
    L.marker(
      [
        route[0].latitude,
        route[0].longitude,
      ],
      {
        icon:
          startLocationIcon,
      }
    )
      .addTo(
        map
      )
      .bindPopup(
        "Start"
      );

  const last =
    route[
      route.length -
        1
    ];

  homeEndMarker =
    L.marker(
      [
        last.latitude,
        last.longitude,
      ],
      {
        icon:
          finishLocationIcon,
      }
    )
      .addTo(
        map
      )
      .bindPopup(
        "Finish"
      );

  if (
    bounds.isValid()
  ) {
    map.fitBounds(
      bounds,
      {
        padding: [
          25,
          25,
        ],
      }
    );
  }

  speedDisplay.textContent =
    Math.round(
      Number(
        last.speed
      ) || 0
    );

  distanceDisplay.textContent =
    `${Number(
      latestDrive.distance ||
        0
    ).toFixed(
      2
    )} km`;

  topSpeedDisplay.textContent =
    `${Math.round(
      Number(
        latestDrive.topSpeed ||
          0
      )
    )} km/h`;

  averageSpeedDisplay.textContent =
    `${Math.round(
      Number(
        latestDrive.averageSpeed ||
          0
      )
    )} km/h`;

  durationDisplay.textContent =
    formatDuration(
      Number(
        latestDrive.duration ||
          0
      )
    );

  movingTimeDisplay.textContent =
    formatDuration(
      Number(
        latestDrive.movingTime ||
          0
      )
    );

  stoppedTimeDisplay.textContent =
    formatDuration(
      Number(
        latestDrive.stoppedTime ||
          0
      )
    );

  driveState.textContent =
    "Last drive";
}

/* =========================================================
   HOME MAP SIZE REFRESH
   ========================================================= */

function refreshHomeMapSize() {
  setTimeout(
    () => {
      if (
        map
      ) {
        map.invalidateSize();
      }
    },
    100
  );
}

/* =========================================================
   TAB BUTTONS
   ========================================================= */

homeTab.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  homePage.hidden = false;
  drivesPage.hidden = true;

  homeTab.classList.add("active");
  drivesTab.classList.remove("active");

  currentTab = "home";

  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 100);
});

drivesTab.addEventListener("click", function () {
  homePage.hidden = true;
  drivesPage.hidden = false;
  homeTab.classList.remove("active");
  drivesTab.classList.add("active");

  currentTab = "drives";
});

/* =========================================================
   REFRESH HOME AFTER DRIVE CHANGES
   ========================================================= */

function refreshHomeAfterDriveChange() {
  if (
    driving
  ) {
    return;
  }

  initializeSavedDriveOnHome();

  updateOverallStats();

  refreshHomeMapSize();
}

/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      !document.hidden &&
      currentTab ===
        "home"
    ) {
      refreshHomeMapSize();
    }

    if (
      !document.hidden &&
      currentTab ===
        "drives" &&
      historyMap
    ) {
      setTimeout(
        () => {
          historyMap.invalidateSize();
        },
        100
      );
    }
  }
);

/* =========================================================
   INITIAL APP STATE
   ========================================================= */

homePage.hidden =
  false;

drivesPage.hidden =
  true;

homeTab.classList.add(
  "active"
);

drivesTab.classList.remove(
  "active"
);

currentTab =
  "home";

statusDot.classList.remove(
  "active"
);

driveState.textContent =
  "Ready to drive";

speedDisplay.textContent =
  "0";

durationDisplay.textContent =
  "00:00:00";

distanceDisplay.textContent =
  "0.00 km";

topSpeedDisplay.textContent =
  "0 km/h";

averageSpeedDisplay.textContent =
  "0 km/h";

movingTimeDisplay.textContent =
  "00:00:00";

stoppedTimeDisplay.textContent =
  "00:00:00";

gpsMessage.textContent =
  "GPS ready";

/* =========================================================
   INITIAL MAP / HISTORY
   ========================================================= */

refreshHomeMapSize();

initializeSavedDriveOnHome();

renderHistory();

updateOverallStats();

/* =========================================================
   KEEP MAPS CORRECT AFTER RESIZE
   ========================================================= */

window.addEventListener(
  "orientationchange",
  () => {
    setTimeout(
      () => {
        if (
          map
        ) {
          map.invalidateSize();
        }

        if (
          historyMap
        ) {
          historyMap.invalidateSize();
        }
      },
      300
    );
  }
);

/* =========================================================
   PREVENT ACCIDENTAL DATA LOSS
   ========================================================= */

window.addEventListener(
  "beforeunload",
  () => {
    if (
      driving
    ) {
      console.warn(
        "Drive is currently active."
      );
    }
  }
);
