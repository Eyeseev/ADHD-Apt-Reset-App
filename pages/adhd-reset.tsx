import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const TODAY_TASKS = [
  { id: "t1", emoji: "📸", title: "Take before photos", time: "5 min", why: "Commits you to the reset. Feels like starting. Is starting.", mvp: true },
  { id: "t2", emoji: "🧺", title: "Put away ALL clean laundry", time: "20–40 min", why: "Single biggest unlock. Clears the bed, couch, and floor simultaneously.", mvp: true },
  { id: "t3", emoji: "🍽️", title: "Wash the dishes", time: "15–20 min", why: "Kitchen feels immediately usable. Big visual payoff for low effort.", mvp: false },
  { id: "t4", emoji: "🛋️", title: "Clear the coffee table + couch", time: "10 min", why: "The living area transforms. You'll feel the difference immediately.", mvp: false },
  { id: "t5", emoji: "🚗", title: "Put luggage in the car", time: "2 min", why: "It's just sitting there. Move it now. One less thing.", mvp: false },
  { id: "t6", emoji: "🚪", title: "Clear the entryway", time: "10 min", why: "Remove the sign maker, put the cooler away, find homes for lids + gloves.", mvp: false },
];

const TODAY_BREAKS = [
  { after: 2, label: "☕ Break", duration: "10–15 min", note: "Drink something. Sit down. Don't clean." },
  { after: 4, label: "🍔 Break", duration: "20–30 min", note: "Eat a real meal. Leave the apartment if you can." },
];

const ZONES = [
  { zone: "🚪 Entryway", tasks: [
    "Find a permanent home for the plastic lids",
    "Find a permanent home for the gloves",
    "Put away the cooler",
    "Remove the sign maker / chalk thing from the entryway",
    "Decide: keep, move, or rehome the aquarium",
    "Set up launch pad tray near the door (keys, wallet, phone, meds, glasses)",
    "Install wall hooks next to the door (daily bag, jacket, umbrella)",
    "Set up mail triage station — slim wall-mounted sorter with 'To Do' and 'Trash' slots",
    "Place a large welcome mat / rug as a 3-ft buffer zone",
    "Use the empty middle shelf of the aquarium shelf unit as the 'things leaving soon' bin",
  ]},
  { zone: "🍳 Kitchen", tasks: [
    "Wash the dishes",
    "Clear and declutter the kitchen island",
    "Clear and declutter the kitchen counters",
    "Organize pots and pans",
    "Mop and deep clean the floors",
    "Set up coffee neighborhood: coffee maker, mugs, beans, spoons, sweeteners grouped together",
    "Set up cooking neighborhood: salt, pepper, spatula, cutting board on a tray or lazy Susan near stove",
    "Set up cleaning neighborhood: dish soap, sponge, dish towel on a tray next to the sink",
    "Set up kitchen landing tray: one tray for daily items (vitamins, cables) — clear nightly",
    "Post a 3-step cooking finish routine near the stove",
    "Install magnetic spice rack on the fridge",
    "Add hooks on the wall next to the stove",
    "Add a 3-tier corner shelf behind the sink",
    "Add cabinet LED lights in the pantry",
    "Plant herb garden using the window sill planter from the pantry",
  ]},
  { zone: "🛋️ Living Area", tasks: [
    "Clear and declutter the couch (mostly clothes — put away or launder)",
    "Declutter the coffee table",
    "Declutter the storage bench",
    "Find places for zip ties, tape, and extra materials",
    "Set up coffee table corral: one tray/basket on the bottom shelf for remotes, glasses, chargers",
    "Set up the Doom Box: a clear labeled bin ('Sort Later') for items without a home — empty it weekly",
  ]},
  { zone: "🖥️ Desk / Work Zone", tasks: [
    "Declutter the desk",
    "Add a physical inbox tray on the desk",
    "Place a rug under the desk to define the work zone",
    "Set up cool lighting (5000K) around the desk area for work mode",
    "Add shelving on the large empty wall next to the desk",
  ]},
  { zone: "🛏️ Bedroom / Closet", tasks: [
    "Put away all clean laundry from the couch and bed",
    "Finish sorting and putting away socks so the bed is cleared",
    "Organize the sock dresser",
    "Clear and declutter the top of the dresser",
    "Designate a 'clothes purgatory' basket: worn-once items not ready for the wash — label it",
    "Move laundry hampers to wherever clothes actually come off (bathroom + near bed)",
    "Organize both nightstands and declutter them",
    "Set up nightstand tray: phone, glasses, lip balm, medications",
    "Check and declutter the under-bed bin",
    "Go through clear bins in the wardrobe closet and reorganize",
    "Decide on the nook: wardrobe extension (curtain rod + curtain) OR comfort nook with decor, books",
    "Get a slim tall dresser or IKEA organizer for next to the left nightstand (ceiling ~9 ft)",
    "Set up a calm corner: soft rug, warm lighting, weighted blanket, soft pillows",
    "Set up warm lighting (2700K or lower) for the bedroom",
  ]},
  { zone: "🚿 Bathroom", tasks: [
    "Set up a get-ready bin: portable bin with only daily routine products",
    "Install an over-the-door organizer with clear pockets (medications, hair accessories, grooming tools)",
    "Add shelves in the bathroom",
    "Buy and install a larger bathroom mirror with built-in storage",
    "Add a shower caddy or mounted shelf so products leave the counter",
    "Set up a small bathroom cleaning kit",
    "Post nightly routine checklist on the bathroom mirror",
  ]},
  { zone: "🗄️ Utility Closet / Storage", tasks: [
    "Reorganize the utility closet",
    "Mount brooms in the utility closet",
    "Move vacuum to the utility closet",
    "Move utility bins from wardrobe closet to utility closet (computers, old electronics)",
    "Move seasonal AC equipment to the utility closet",
    "Use the under-bed bin for seasonal item storage",
  ]},
  { zone: "📋 Paperwork / Admin", tasks: [
    "Organize the filing cabinet",
    "Go through all paperwork — digitize what you can, shred what you don't need physically",
    "Maintain only what legally must be kept in physical form",
  ]},
  { zone: "🏷️ Sell / Return / Relocate", tasks: [
    "Return luggage to mom (put in the car TODAY)",
    "List the computers for sale",
    "List the mic amps for sale",
    "List the electric heater / furnace for sale",
    "Research and buy a new TV stand with storage (after heater sells)",
  ]},
];

const SHOPPING = [
  { cat: "Entryway", items: ["Large welcome mat", "Wall hooks (5–6 pack)", "Shallow tray or basket (launch pad)", "Slim wall-mounted mail sorter (2-slot)"] },
  { cat: "Kitchen", items: ["Magnetic spice rack (fridge-mounted)", "Lazy Susan or small tray (cooking neighborhood)", "Small tray (cleaning neighborhood, by sink)", "3-tier corner shelf (behind sink)", "Cabinet LED lights (pantry)", "Kitchen landing tray or small basket"] },
  { cat: "Living Area", items: ["Clear labeled bin (Doom Box — 'Sort Later')", "Small tray or basket (coffee table corral, use bottom shelf)"] },
  { cat: "Desk", items: ["Small inbox tray", "Desk-area rug", "Cool bulbs or LED strip (5000K)"] },
  { cat: "Bedroom", items: ["Laundry basket or bin (clothes purgatory)", "Small tray (nightstand)", "Slim tall dresser or IKEA nook organizer", "Soft rug (calm corner)", "Warm bulbs (2700K)", "New TV stand with storage (buy only after heater sells)"] },
  { cat: "Bathroom", items: ["Over-door organizer with clear pockets", "Shower caddy or mounted shelf", "Larger bathroom mirror with built-in storage", "Portable get-ready bin or basket"] },
  { cat: "Misc", items: ["Curtain rod + curtain (if nook becomes wardrobe extension)", "Sticky notepads or dry-erase cards (posting mini checklists)", "Clear stackable storage bins (utility closet)"] },
];

const DECLUTTER = [
  { label: "Rehome / Decide", color: "#C084FC", items: ["Aquarium — keep, move, or rehome?", "Electric heater — sell it", "Computers — sell them", "Mic amps — sell them", "Luggage — return to mom TODAY"] },
  { label: "Find a Home", color: "#38BDF8", items: ["Plastic lids", "Gloves", "Zip ties + tape + extra materials", "Cooler", "Sign maker / chalk thing"] },
  { label: "Clear These Surfaces", color: "#4ADE80", items: ["Bed (clothes)", "Couch (clothes)", "Coffee table", "Kitchen island", "Kitchen counters", "Top of dresser", "Both nightstands"] },
  { label: "Go Through These", color: "#FACC15", items: ["Clear bins in wardrobe closet", "Utility closet", "Under-bed bin", "Storage bench", "Filing cabinet + paperwork"] },
];

const PHASES = [
  {
    num: "01", label: "Fast Reset / Momentum", color: "#4ADE80",
    goal: "Make the apartment feel livable. Clear the most visible chaos. Get momentum.",
    effort: "Low–Medium",
    doFirst: "Put away all laundry. This one action clears the bed, couch, and most surfaces.",
    tasks: [
      "📸 Take before photos",
      "Put away all clean laundry — bed, couch, floor piles",
      "Finish sorting and putting away socks",
      "Wash the dishes",
      "Clear the coffee table",
      "Clear the couch",
      "Put luggage in the car to return to mom",
      "Remove sign maker / chalk thing from entryway",
      "Put cooler away",
      "Quick trash sweep of the whole apartment",
      "Mop / sweep floors",
    ],
    canWait: "Buying anything new. Organizing systems. Filing cabinet. Utility closet.",
    bottleneck: "Laundry must come first — it's blocking multiple zones simultaneously.",
  },
  {
    num: "02", label: "Declutter + Remove Obstacles", color: "#38BDF8",
    goal: "Remove what doesn't belong. Make the hard decisions. Clear the way for organizing.",
    effort: "Medium–High",
    doFirst: "Go through the wardrobe closet bins — this unlocks the utility closet overhaul.",
    tasks: [
      "Decide: keep, move, or rehome the aquarium",
      "Go through clear bins in wardrobe closet — sort into keep, donate, sell, trash",
      "Move utility bins (electronics, AC stuff) to utility closet",
      "Mount brooms and vacuum in utility closet",
      "Declutter storage bench",
      "Declutter both nightstands",
      "Check and declutter under-bed bin",
      "Clear and declutter top of the dresser",
      "Clear kitchen island and counters",
      "Go through paperwork — digitize, shred, file",
      "List computers and mic amps for sale",
      "List electric heater for sale",
      "Find homes for zip ties, tape, and loose materials",
      "Find a place for plastic lids",
      "Find a place for gloves",
    ],
    canWait: "Buying new storage. Organizing pots and pans. Desk wall shelving.",
    bottleneck: "Aquarium decision affects the whole entryway plan. Don't skip it.",
  },
  {
    num: "03", label: "Organize by Zone", color: "#C084FC",
    goal: "Build the neighborhood system room by room. Every item gets a logical home.",
    effort: "Medium",
    doFirst: "Start with the kitchen — it has the most daily friction and the most payoff.",
    tasks: [
      "Set up coffee neighborhood",
      "Set up cooking neighborhood (tray/lazy Susan near stove)",
      "Set up cleaning neighborhood (tray by sink)",
      "Organize pots and pans",
      "Add spice rack on fridge",
      "Add hooks next to stove",
      "Add corner shelf behind sink",
      "Add cabinet lights in pantry",
      "Set up kitchen landing tray",
      "Set up clothes purgatory spot with label",
      "Organize sock dresser",
      "Organize both nightstands",
      "Set up nightstand tray",
      "Organize desk and set up work zone inbox tray",
      "Set up bathroom get-ready bin",
      "Add over-the-door organizer in bathroom",
      "Set up Doom Box",
      "Set up launch pad near front door",
      "Install wall hooks near front door",
      "Set up mail triage station",
      "Place rug at the front door buffer zone",
      "Set up coffee table corral",
    ],
    canWait: "Buying new furniture. Shelving installs. Lighting upgrades.",
    bottleneck: "Don't try to do all zones in one day. One zone per session.",
  },
  {
    num: "04", label: "Easy-Maintenance Systems", color: "#FB923C",
    goal: "Upgrade storage, lighting, and visual cues so the apartment stays functional without effort.",
    effort: "Medium–High",
    doFirst: "Post routine checklists — they are free, fast, and immediately reduce mental load.",
    tasks: [
      "Post cooking finish routine near the stove",
      "Post nightly reset checklist on bathroom mirror and/or fridge",
      "Set up 3-tier energy routine (green/orange/red tasks)",
      "Set up cool work lighting (5000K) around desk",
      "Set up warm calm lighting (2700K) for bedroom/calm corner",
      "Create calm corner: rug, warm light, weighted blanket, pillows",
      "Decide on nook: wardrobe extension OR comfort nook",
      "Add slim tall dresser or IKEA organizer next to left nightstand",
      "Buy new TV stand with storage (after heater is sold)",
      "Add shelving on big wall next to desk",
      "Add shelves in bathroom",
      "Buy bathroom mirror with storage",
      "Add shower/bathtub caddy or mounted shelf",
      "Add herb garden using window sill planter",
      "Move hampers to where clothes actually come off",
      "Place rug under desk for work zone definition",
      "📸 Take after photos",
    ],
    canWait: "Major furniture upgrades. Desk replacement. Vision board area.",
    bottleneck: "Sell the heater before buying the TV stand — don't create clutter buying things in.",
  },
];

const WEEKS = [
  {
    week: "Week 1", theme: "Visible Reset", focus: "Phase 1 tasks only. Get momentum.",
    days: [
      { day: "Day 1 (1–2 hrs)", tasks: ["Take before photos", "Put away ALL laundry — bed, couch, floor", "Finish socks"] },
      { day: "Day 2 (30 min)", tasks: ["Clear coffee table", "Clear couch", "Put luggage in car", "Quick trash sweep"] },
      { day: "Day 3 (1 hr)", tasks: ["Wash dishes", "Clear kitchen island and counters", "Mop floors"] },
      { day: "Day 4 (30 min)", tasks: ["Remove sign maker from entryway", "Put cooler away", "Remove aquarium clutter from entryway"] },
      { day: "Days 5–7", tasks: ["Rest. You earned it. Don't start Phase 2 yet."] },
    ],
  },
  {
    week: "Week 2", theme: "Declutter + Decide", focus: "Phase 2 tasks. Decide and remove.",
    days: [
      { day: "Session 1 (1–2 hrs)", tasks: ["Go through wardrobe closet bins", "Move utility stuff to utility closet"] },
      { day: "Session 2 (1 hr)", tasks: ["Declutter nightstands", "Check under bed", "Declutter storage bench"] },
      { day: "Session 3 (1 hr)", tasks: ["Go through paperwork — digitize what you can"] },
      { day: "Session 4 (30 min)", tasks: ["List computers, mic amps, and electric heater for sale", "Find homes for loose items (lids, gloves, zip ties, tape)"] },
    ],
  },
  {
    week: "Week 3", theme: "Build the Systems", focus: "Phase 3 tasks. One zone per session.",
    days: [
      { day: "Session 1", tasks: ["Kitchen neighborhoods (coffee, cooking, cleaning)", "Kitchen landing tray"] },
      { day: "Session 2", tasks: ["Launch pad + hooks + mail triage near front door"] },
      { day: "Session 3", tasks: ["Bedroom: clothes purgatory, sock dresser, nightstand tray, hamper placement"] },
      { day: "Session 4", tasks: ["Bathroom: get-ready bin, over-door organizer", "Doom Box setup"] },
      { day: "Session 5", tasks: ["Desk work zone: inbox tray, rug, lighting"] },
    ],
  },
  {
    week: "Week 4+", theme: "Upgrades + Finishing", focus: "Phase 4. Shop, install, polish.",
    days: [
      { day: "Ongoing", tasks: ["Post checklists (stove, mirror)", "Buy and install spice rack, hooks, corner shelf, shower caddy", "Set up calm corner", "Buy bathroom mirror with storage", "Decide on nook use"] },
    ],
  },
];

const DAILY = [
  { tier: "🔴 Red — Always, even low energy (5 min)", color: "#F87171", tasks: ["Clothes go into hamper, purgatory basket, or dresser — never on furniture", "Dishes go in the sink at minimum", "Return launch pad items to the launch pad"] },
  { tier: "🟠 Orange — Medium energy (add 10 min)", color: "#FB923C", tasks: ["Wipe down the kitchen counter", "Wash dishes or load dishwasher", "Clear the coffee table corral"] },
  { tier: "🟢 Green — High energy (add 15 min)", color: "#4ADE80", tasks: ["Clear and wipe kitchen island", "Quick sweep or vacuum", "Empty the Doom Box if it's full", "Do one small put-away loop around the apartment"] },
];

const WEEKLY = [
  "Sunday reset: 20–30 min walk-through, reset all zones",
  "Laundry on a fixed day — same day every week",
  "Empty or process the Doom Box before it overflows",
  "Check the 'things leaving' shelf — take items to the car",
  "Process the mail triage 'To Do' slot",
  "Sweep or Swiffer floors",
];

const GOLDEN_RULES = [
  "One in, one out — before anything new enters, something leaves",
  "If it takes under 2 minutes, do it now",
  "When in doubt, Doom Box it — but empty the box every week",
  "Never put things 'down' — only put things 'away'",
  "Reset the launch pad every night before bed",
];

// ─── THEME ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#0D0C12",
  card: "#16141E",
  border: "#242033",
  surface: "#1E1B2A",
  surfaceLight: "#272440",
  text: "#F0EEF8",
  muted: "#7A788A",
  accent: "#7C5CFC",
  accentLight: "#A78BFA",
  green: "#4ADE80",
  yellow: "#FACC15",
  orange: "#FB923C",
  blue: "#38BDF8",
  purple: "#C084FC",
};

const EFFORT_COLORS: Record<string, { bg: string; text: string }> = {
  "Low–Medium": { bg: "#1A2E35", text: "#38BDF8" },
  "Medium": { bg: "#2D2A1A", text: "#FACC15" },
  "Medium–High": { bg: "#2D1F3A", text: "#C084FC" },
};

const TABS = ["Today", "Master List", "Shopping", "Declutter", "Phases", "Weekly Plan", "Maintenance"];

// ─── HOOKS ──────────────────────────────────────────────────────────────────

// --- Task status + timer hook (reusable across tabs) ---

export type TaskStatus = "idle" | "active" | "paused" | "done";

interface TaskState {
  status: TaskStatus;
  accumulated: number; // seconds stored before the last "start"
  startedAt: number | null;  // ms timestamp of last "start"
}

interface TaskStateActions {
  start: (id: string) => void;
  pause: (id: string) => void;
  complete: (id: string) => void;
  undo: (id: string) => void;
  getStatus: (id: string) => TaskStatus;
  getElapsed: (id: string) => number; // seconds
}

export function useTaskStates(namespace: string): TaskStateActions {
  const storageKey = `adhd-reset-task-states-${namespace}`;
  const [states, setStates] = useState<Record<string, TaskState>>({});
  // Tick counter forces re-render every second when tasks are active
  const [, setTick] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setStates(JSON.parse(stored));
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Single interval — only runs while at least one task is active
  useEffect(() => {
    const hasActive = Object.values(states).some(s => s.status === "active");
    if (!hasActive) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [states]);

  const save = (next: Record<string, TaskState>) => {
    setStates(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  };

  const getState = (id: string): TaskState =>
    states[id] ?? { status: "idle", accumulated: 0, startedAt: null };

  const start = (id: string) => {
    const s = getState(id);
    save({ ...states, [id]: { ...s, status: "active", startedAt: Date.now() } });
  };

  const pause = (id: string) => {
    const s = getState(id);
    if (s.status !== "active") return;
    const extra = s.startedAt ? Math.floor((Date.now() - s.startedAt) / 1000) : 0;
    save({ ...states, [id]: { status: "paused", accumulated: s.accumulated + extra, startedAt: null } });
  };

  const complete = (id: string) => {
    const s = getState(id);
    const extra = s.status === "active" && s.startedAt
      ? Math.floor((Date.now() - s.startedAt) / 1000) : 0;
    save({ ...states, [id]: { status: "done", accumulated: s.accumulated + extra, startedAt: null } });
  };

  const undo = (id: string) => {
    save({ ...states, [id]: { status: "idle", accumulated: 0, startedAt: null } });
  };

  const getStatus = (id: string): TaskStatus => getState(id).status;

  const getElapsed = (id: string): number => {
    const s = getState(id);
    const live = s.status === "active" && s.startedAt
      ? Math.floor((Date.now() - s.startedAt) / 1000) : 0;
    return s.accumulated + live;
  };

  return { start, pause, complete, undo, getStatus, getElapsed };
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// --- Original simple checked hook (used by other tabs) ---

function useChecked(key: string): [Record<string, boolean>, (id: string) => void, () => void] {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`adhd-reset-${key}`);
      if (stored) setChecked(JSON.parse(stored));
    } catch {}
  }, [key]);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(`adhd-reset-${key}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clear = () => {
    setChecked({});
    try { localStorage.removeItem(`adhd-reset-${key}`); } catch {}
  };

  return [checked, toggle, clear];
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Checkbox({ checked, accent = C.accent }: { checked: boolean; accent?: string }) {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
      border: `2px solid ${checked ? accent : C.border}`,
      background: checked ? accent : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.15s",
    }}>
      {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>✓</span>}
    </div>
  );
}

function CheckList({ items, storageKey, accent = C.accent }: { items: string[]; storageKey: string; accent?: string }) {
  const [checked, toggle] = useChecked(storageKey);
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => toggle(String(i))}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none",
            cursor: "pointer", opacity: checked[i] ? 0.35 : 1, transition: "opacity 0.15s",
          }}
        >
          <div style={{ marginTop: 1 }}><Checkbox checked={!!checked[i]} accent={accent} /></div>
          <span style={{ color: C.text, fontSize: 14, lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none" }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "16px 18px", ...style }}>
      {children}
    </div>
  );
}

function Accordion({ title, children, accent = C.accentLight, defaultOpen = false }: {
  title: string; children: React.ReactNode; accent?: string; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 10, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.card, border: "none", color: C.text, padding: "13px 16px",
          cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textAlign: "left",
        }}
      >
        <span style={{ color: accent }}>{title}</span>
        <span style={{ color: C.muted, fontSize: 14, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </button>
      {open && <div style={{ background: C.surface, padding: "12px 16px" }}>{children}</div>}
    </div>
  );
}

function ProgressBar({ completed, total, color = C.accent }: { completed: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{completed} of {total} done</span>
        <span style={{ fontSize: 12, color: pct === 100 ? C.green : color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ background: C.border, borderRadius: 100, height: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 100, background: pct === 100 ? C.green : color, width: `${pct}%`, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// --- Action menu (reusable) ---

interface ActionMenuProps {
  status: TaskStatus;
  onStart: () => void;
  onPause: () => void;
  onDone: () => void;
  onUndo: () => void;
}

function ActionMenu({ status, onStart, onPause, onDone, onUndo }: ActionMenuProps) {
  const btn = (label: string, color: string, onClick: () => void) => (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        background: color + "18", color, border: `1px solid ${color}44`,
        borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        padding: "10px 0 2px",
        borderTop: `1px solid ${C.border}`,
        marginTop: 10,
      }}
    >
      {status === "idle"   && btn("▶ Start",   C.green,  onStart)}
      {status === "active" && btn("⏸ Pause",   C.yellow, onPause)}
      {status === "paused" && btn("▶ Resume",  C.green,  onStart)}
      {status !== "done"   && btn("✓ Done",    C.accent, onDone)}
      {status === "done"   && btn("↩ Undo",    C.muted,  onUndo)}
    </div>
  );
}

// --- Timer badge (reusable) ---

function TimerBadge({ elapsed, status }: { elapsed: number; status: TaskStatus }) {
  if (status !== "active" && status !== "paused") return null;
  const color = status === "active" ? C.green : C.yellow;
  return (
    <span style={{
      fontSize: 11, fontWeight: 800, color,
      background: color + "18", border: `1px solid ${color}44`,
      borderRadius: 6, padding: "2px 8px",
      fontVariantNumeric: "tabular-nums",
    }}>
      {status === "active" ? "⏱ " : "⏸ "}{formatElapsed(elapsed)}
    </span>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────

function TodayTab() {
  const { start, pause, complete, undo, getStatus, getElapsed } = useTaskStates("today");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [mvp, setMvp] = useState(false);

  const visibleTasks = mvp ? TODAY_TASKS.filter(t => t.mvp) : TODAY_TASKS;
  const total = visibleTasks.length;
  const completed = visibleTasks.filter(t => getStatus(t.id) === "done").length;

  const handleTaskClick = (id: string) => {
    setMenuOpenId(prev => prev === id ? null : id);
  };

  const handleAction = (id: string, action: () => void) => {
    action();
    setMenuOpenId(null);
  };

  return (
    <div>
      {/* Dismiss menu overlay */}
      {menuOpenId && (
        <div
          onClick={() => setMenuOpenId(null)}
          style={{ position: "fixed", inset: 0, zIndex: 10 }}
        />
      )}

      {/* Header card */}
      <Card style={{ marginBottom: 16, background: "#180D2A", border: `1px solid #2D1A4A` }}>
        <div style={{ fontSize: 12, color: C.accentLight, fontWeight: 700, marginBottom: 4 }}>The Rule</div>
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
          Do <strong>laundry first</strong>. It clears the bed, couch, floor, and dresser all at once. Everything else gets easier after.
        </div>
      </Card>

      {/* Progress */}
      <Card style={{ marginBottom: 16 }}>
        <ProgressBar completed={completed} total={total} />
      </Card>

      {/* MVP toggle */}
      <div style={{
        background: "#180D2A", border: `1px solid #2D1A4A`, borderRadius: 12,
        padding: "12px 16px", marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.yellow, marginBottom: 2 }}>⚡ Minimum Viable Win</div>
          <div style={{ fontSize: 12, color: C.muted }}>Lost steam? Switch to this. 2 tasks. Still counts.</div>
        </div>
        <button
          onClick={() => setMvp(m => !m)}
          style={{
            background: mvp ? C.yellow : C.surface, color: mvp ? "#000" : C.muted,
            border: `1px solid ${mvp ? C.yellow : C.border}`,
            borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s",
          }}
        >
          {mvp ? "MVP ON" : "Switch to MVP"}
        </button>
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visibleTasks.map((task, i) => {
          const status = getStatus(task.id);
          const elapsed = getElapsed(task.id);
          const isActive = status === "active";
          const isPaused = status === "paused";
          const isDone = status === "done";
          const menuOpen = menuOpenId === task.id;
          const breakAfter = !mvp && TODAY_BREAKS.find(b => b.after === i + 1);

          // Border glow per status
          const borderColor = isActive ? C.accent
            : isPaused ? C.yellow
            : isDone ? "#1F1D26"
            : C.border;
          const boxShadow = isActive ? `0 0 0 1px ${C.accent}, 0 0 16px ${C.accent}44`
            : isPaused ? `0 0 0 1px ${C.yellow}, 0 0 12px ${C.yellow}33`
            : "none";

          return (
            <div key={task.id} style={{ position: "relative", zIndex: menuOpen ? 20 : 1 }}>
              <div
                onClick={() => handleTaskClick(task.id)}
                style={{
                  background: isDone ? "#141214" : C.card,
                  border: `1px solid ${borderColor}`,
                  boxShadow,
                  borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                  opacity: isDone ? 0.45 : 1, transition: "box-shadow 0.2s, border-color 0.2s, opacity 0.2s",
                }}
              >
                {/* Top row: step indicator + content */}
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: isDone ? C.accent : isActive ? C.accent + "33" : C.surface,
                    border: `2px solid ${isDone || isActive ? C.accent : isPaused ? C.yellow : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isDone
                      ? <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>
                      : <span style={{ color: C.muted, fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                    }
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Title row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15 }}>{task.emoji}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: isDone ? C.muted : C.text, textDecoration: isDone ? "line-through" : "none" }}>
                        {task.title}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, background: C.surface, borderRadius: 6, padding: "2px 8px" }}>
                        {task.time}
                      </span>
                      {/* Status badges */}
                      {isActive && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.green, background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 6, padding: "2px 8px" }}>
                          Doing Now
                        </span>
                      )}
                      {isPaused && (
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.yellow, background: C.yellow + "18", border: `1px solid ${C.yellow}44`, borderRadius: 6, padding: "2px 8px" }}>
                          Paused
                        </span>
                      )}
                    </div>
                    {/* Why text */}
                    <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{task.why}</div>
                    {/* Timer */}
                    {(isActive || isPaused) && (
                      <div style={{ marginTop: 6 }}>
                        <TimerBadge elapsed={elapsed} status={status} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action menu (inline, below content) */}
                {menuOpen && (
                  <ActionMenu
                    status={status}
                    onStart={() => handleAction(task.id, () => start(task.id))}
                    onPause={() => handleAction(task.id, () => pause(task.id))}
                    onDone={() => handleAction(task.id, () => complete(task.id))}
                    onUndo={() => handleAction(task.id, () => undo(task.id))}
                  />
                )}
              </div>

              {breakAfter && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 16px", borderRadius: 10,
                  background: "#131020", border: `1px dashed #2D2645`, margin: "4px 0",
                }}>
                  <span style={{ fontSize: 14 }}>{breakAfter.label}</span>
                  <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{breakAfter.duration}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{breakAfter.note}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Done message */}
      {completed === total && (
        <div style={{ marginTop: 20, padding: "20px", borderRadius: 14, textAlign: "center", background: "#0D1F15", border: `1px solid #1A4A30` }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.green, marginBottom: 4 }}>You did it.</div>
          <div style={{ fontSize: 13, color: C.muted }}>That's the whole day. Rest now. Tomorrow is Phase 2.</div>
        </div>
      )}

      {completed < total && (
        <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          <span style={{ color: C.text, fontWeight: 700 }}>Remember: </span>
          Do tasks in order. Don't skip ahead. A finished task beats a perfect one.
        </div>
      )}
    </div>
  );
}

function MasterTab() {
  const totalTasks = ZONES.reduce((sum, z) => sum + z.tasks.length, 0);
  const [allChecked] = useChecked("master-all");
  const completedAll = Object.values(allChecked).filter(Boolean).length;

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Overall project progress</div>
        <ProgressBar completed={completedAll} total={totalTasks} />
      </Card>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>Every task, by zone. Tap to expand. Progress saves automatically.</p>
      {ZONES.map((z, zi) => (
        <ZoneAccordion key={zi} zone={z} zoneIndex={zi} />
      ))}
    </div>
  );
}

function ZoneAccordion({ zone, zoneIndex }: { zone: { zone: string; tasks: string[] }; zoneIndex: number }) {
  const storageKey = `master-zone-${zoneIndex}`;
  const [checked, toggle] = useChecked(storageKey);
  const [open, setOpen] = useState(false);
  const completed = zone.tasks.filter((_, i) => !!checked[i]).length;

  return (
    <div style={{ marginBottom: 10, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: C.card, border: "none", color: C.text,
          padding: "13px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.accentLight }}>{zone.zone}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: completed === zone.tasks.length ? C.green : C.muted }}>
              {completed}/{zone.tasks.length}
            </span>
            <span style={{ color: C.muted, fontSize: 14, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
          </div>
        </div>
        {!open && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: C.border, borderRadius: 100, height: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 100, background: completed === zone.tasks.length ? C.green : C.accent, width: `${(completed / zone.tasks.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}
      </button>
      {open && (
        <div style={{ background: C.surface, padding: "12px 16px" }}>
          {zone.tasks.map((task, i) => (
            <div
              key={i}
              onClick={() => toggle(String(i))}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0",
                borderBottom: i < zone.tasks.length - 1 ? `1px solid ${C.border}` : "none",
                cursor: "pointer", opacity: checked[i] ? 0.35 : 1, transition: "opacity 0.15s",
              }}
            >
              <div style={{ marginTop: 1 }}><Checkbox checked={!!checked[i]} /></div>
              <span style={{ color: C.text, fontSize: 13, lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none" }}>{task}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShoppingTab() {
  return (
    <div>
      <Card style={{ marginBottom: 16, background: "#0D1A1A", border: `1px solid #1A3A3A` }}>
        <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 4 }}>⚠️ Don't shop yet</div>
        <div style={{ fontSize: 13, color: C.text }}>Complete Phase 1 (Fast Reset) first. Buy only what you need for Phase 3. Sell items first before buying replacements.</div>
      </Card>
      {SHOPPING.map((s, i) => (
        <Accordion key={i} title={s.cat} accent={C.blue}>
          <CheckList items={s.items} storageKey={`shopping-${i}`} accent={C.blue} />
        </Accordion>
      ))}
    </div>
  );
}

function DeclutterTab() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>Work through these categories. Each one unblocks something else.</p>
      {DECLUTTER.map((d, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: d.color, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{d.label}</div>
          <Card>
            <CheckList items={d.items} storageKey={`declutter-${i}`} accent={d.color} />
          </Card>
        </div>
      ))}
    </div>
  );
}

function PhasesTab() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>Complete phases in order — each one unlocks the next. Tap a phase to expand.</p>
      {PHASES.map((ph, i) => (
        <PhaseCard key={i} ph={ph} phaseIndex={i} />
      ))}
    </div>
  );
}

function PhaseCard({ ph, phaseIndex }: { ph: typeof PHASES[0]; phaseIndex: number }) {
  const [open, setOpen] = useState(false);
  const [checked, toggle] = useChecked(`phase-${phaseIndex}`);
  const completed = ph.tasks.filter((_, i) => !!checked[i]).length;
  const effortColor = EFFORT_COLORS[ph.effort] || { bg: "#222", text: "#aaa" };

  return (
    <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 14, overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: ph.color, lineHeight: 1 }}>{ph.num}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{ph.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{ph.goal}</div>
            </div>
          </div>
          <span style={{ background: effortColor.bg, color: effortColor.text, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{ph.effort}</span>
        </div>
        <ProgressBar completed={completed} total={ph.tasks.length} color={ph.color} />
        <div style={{ textAlign: "right", marginTop: 8, color: C.muted, fontSize: 13 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "0 18px 18px" }}>
          <div style={{ marginTop: 14, marginBottom: 12, padding: "10px 14px", background: C.surface, borderRadius: 8 }}>
            <span style={{ color: C.green, fontWeight: 700, fontSize: 12 }}>Do First: </span>
            <span style={{ color: C.text, fontSize: 12 }}>{ph.doFirst}</span>
          </div>
          {ph.tasks.map((task, i) => (
            <div
              key={i}
              onClick={() => toggle(String(i))}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0",
                borderBottom: i < ph.tasks.length - 1 ? `1px solid ${C.border}` : "none",
                cursor: "pointer", opacity: checked[i] ? 0.35 : 1, transition: "opacity 0.15s",
              }}
            >
              <div style={{ marginTop: 1 }}><Checkbox checked={!!checked[i]} accent={ph.color} /></div>
              <span style={{ color: C.text, fontSize: 13, lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none" }}>{task}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#2D1F0A", borderRadius: 8, border: "1px solid #7C3A0033" }}>
            <span style={{ color: C.orange, fontWeight: 700, fontSize: 12 }}>⚠️ Bottleneck: </span>
            <span style={{ color: C.text, fontSize: 12 }}>{ph.bottleneck}</span>
          </div>
          <div style={{ marginTop: 8, padding: "10px 14px", background: "#1A1A2D", borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ color: C.muted, fontWeight: 700, fontSize: 12 }}>Can Wait: </span>
            <span style={{ color: C.muted, fontSize: 12 }}>{ph.canWait}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WeeklyPlanTab() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>A realistic schedule. Sessions, not marathons. Work with your energy, not against it.</p>
      {WEEKS.map((wk, wi) => (
        <div key={wi} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", background: C.surfaceLight, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{wk.week}</span>
            <span style={{ background: C.accent + "22", color: C.accentLight, borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 700 }}>{wk.theme}</span>
          </div>
          <div style={{ padding: "12px 18px" }}>
            <p style={{ color: C.muted, fontSize: 12, marginTop: 0, marginBottom: 12 }}>{wk.focus}</p>
            {wk.days.map((d, di) => (
              <div key={di} style={{ marginBottom: 10 }}>
                <div style={{ color: C.accentLight, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{d.day}</div>
                {d.tasks.map((t, ti) => (
                  <div key={ti} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "3px 0" }}>
                    <span style={{ color: C.accent, flexShrink: 0, marginTop: 2, fontSize: 10 }}>◆</span>
                    <span style={{ color: C.text, fontSize: 13 }}>{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MaintenanceTab() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 16 }}>Simple rules that keep everything from falling apart. The whole system runs on low energy.</p>
      <Card style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", background: C.surfaceLight }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>⚡ Daily Reset (Tiered by Energy)</span>
        </div>
        <div style={{ padding: "12px 18px" }}>
          {DAILY.map((tier, ti) => (
            <div key={ti} style={{ marginBottom: ti < DAILY.length - 1 ? 18 : 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: tier.color }}>{tier.tier}</div>
              {tier.tasks.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
                  <span style={{ color: tier.color, flexShrink: 0, fontSize: 10, marginTop: 3 }}>◆</span>
                  <span style={{ color: C.text, fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", background: C.surfaceLight }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>📅 Weekly Reset (20–30 min)</span>
        </div>
        <div style={{ padding: "12px 18px" }}>
          <CheckList items={WEEKLY} storageKey="weekly-reset" accent={C.blue} />
        </div>
      </Card>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", background: C.surfaceLight }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: C.text }}>🏆 Golden Rules</span>
        </div>
        <div style={{ padding: "12px 18px" }}>
          {GOLDEN_RULES.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < GOLDEN_RULES.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ color: C.yellow, fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: C.text, fontSize: 14 }}>{r}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function ADHDReset() {
  const [tab, setTab] = useState(0);

  const tabContent = [
    <TodayTab key="today" />,
    <MasterTab key="master" />,
    <ShoppingTab key="shopping" />,
    <DeclutterTab key="declutter" />,
    <PhasesTab key="phases" />,
    <WeeklyPlanTab key="weekly" />,
    <MaintenanceTab key="maintenance" />,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1A0A3A 0%, ${C.bg} 60%)`, padding: "28px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.accentLight, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>ADHD Apt Reset</div>
          <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.1, marginBottom: 4 }}>Your Game Plan</div>
          <div style={{ fontSize: 13, color: C.muted }}>A momentum-first system for resetting your apartment. Progress saves automatically.</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        <div style={{ display: "flex", maxWidth: 680, margin: "0 auto", padding: "0 8px" }}>
          {TABS.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                background: "none", border: "none", fontFamily: "inherit",
                color: tab === i ? C.accent : C.muted,
                borderBottom: tab === i ? `2px solid ${C.accent}` : "2px solid transparent",
                padding: "12px 12px", fontSize: 12, fontWeight: tab === i ? 800 : 500,
                cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
