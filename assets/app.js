const { useState, useEffect } = React;
const VIBES = [
    { id: "cabin", label: "Cabin & Treehouse", emoji: "🌲" },
    { id: "beach", label: "Beach Escape", emoji: "🏖️" },
    { id: "eco", label: "Eco & Off-Grid", emoji: "🌿" },
    { id: "wine", label: "Wine & Foodie", emoji: "🍷" },
    { id: "family", label: "Family Friendly", emoji: "👨‍👩‍👧" },
    { id: "adventure", label: "Adventure & Hiking", emoji: "🥾" },
    { id: "wellness", label: "Wellness & Slow", emoji: "💆" },
    { id: "hidden", label: "Hidden Gems", emoji: "✨" },
];
const DISTANCES = [
    { id: "2", label: "2 hrs", desc: "Blue Mountains, Central Coast" },
    { id: "3", label: "3 hrs", desc: "South Coast, Jervis Bay" },
    { id: "4", label: "4 hrs", desc: "Snowy Mountains, Mudgee" },
];
const GROUPS = [
    { id: "solo", label: "Solo", emoji: "🧍", guests: 1 },
    { id: "couple", label: "Couple", emoji: "👫", guests: 2 },
    { id: "family", label: "Family", emoji: "👨‍👩‍👧", guests: 4 },
    { id: "friends", label: "Friends", emoji: "👥", guests: 4 },
];
const BUDGETS = [
    { id: "500", label: "Under $500", desc: "Keep it lean" },
    { id: "1000", label: "$500-$1,000", desc: "Budget-friendly" },
    { id: "2000", label: "$1,000-$2,000", desc: "Comfortable" },
    { id: "2000plus", label: "$2,000+", desc: "Premium" },
    { id: "any", label: "No budget", desc: "Best fit" },
];
const DESTINATION_BUDGETS = {
    "blue mountains": { couple: "$450-$900", family: "$800-$1,500", level: 2, type: "Popular Favourite" },
    "central coast": { couple: "$450-$950", family: "$850-$1,600", level: 2, type: "Popular Favourite" },
    "terrigal": { couple: "$550-$1,100", family: "$950-$1,800", level: 2, type: "Popular Favourite" },
    "kiama": { couple: "$550-$1,100", family: "$950-$1,800", level: 2, type: "Popular Favourite" },
    "berry": { couple: "$650-$1,200", family: "$1,100-$2,000", level: 3, type: "Popular Favourite" },
    "kangaroo valley": { couple: "$600-$1,200", family: "$1,000-$1,900", level: 3, type: "Hidden Gem" },
    "jervis bay": { couple: "$650-$1,300", family: "$1,100-$2,100", level: 3, type: "Popular Favourite" },
    "hunter valley": { couple: "$750-$1,600", family: "$1,200-$2,300", level: 3, type: "Popular Favourite" },
    "mudgee": { couple: "$600-$1,200", family: "$1,000-$1,800", level: 3, type: "Hidden Gem" },
    "orange": { couple: "$650-$1,300", family: "$1,100-$2,000", level: 3, type: "Popular Favourite" },
    "seal rocks": { couple: "$500-$1,000", family: "$900-$1,700", level: 2, type: "Hidden Gem" },
    "forster": { couple: "$550-$1,100", family: "$950-$1,800", level: 2, type: "Popular Favourite" },
    "bega valley": { couple: "$500-$1,000", family: "$900-$1,600", level: 2, type: "Hidden Gem" },
};
function budgetLabel(id) { const b = BUDGETS.find(x => x.id === id); return b ? b.label : "No budget"; }
function lookupBudget(dest) { const name = (dest.destination || "").toLowerCase(); const key = Object.keys(DESTINATION_BUDGETS).find(k => name.includes(k)); return key ? DESTINATION_BUDGETS[key] : { couple: "$550-$1,200", family: "$950-$1,900", level: 3, type: "Hidden Gem" }; }
function enrichDestination(dest, ctx = {}) { const base = lookupBudget(dest); const groupType = ctx.group === "family" || ctx.group === "friends" ? "family" : "couple"; const v = VIBES.find(x => x.id === ctx.vibe); const b = BUDGETS.find(x => x.id === ctx.budget); return { ...dest, budget_couple: dest.budget_couple || base.couple, budget_family: dest.budget_family || base.family, budget_level: dest.budget_level || base.level, gem_type: dest.gem_type || base.type, typical_budget: groupType === "family" ? (dest.budget_family || base.family) : (dest.budget_couple || base.couple), why_picked: dest.why_picked || `Picked because it matches your ${v ? v.label.toLowerCase() : "weekend escape"} vibe, is within about ${ctx.distance || "3"} hours of Sydney, and suits your ${b && b.id !== "any" ? b.label + " budget" : "trip"}${ctx.pet ? " with pet-friendly options" : ""}.` }; }
function budgetFits(dest, budget) { if (!budget || budget === "any" || budget === "2000plus") return true; const level = Number(dest.budget_level || lookupBudget(dest).level || 3); if (budget === "500") return level <= 1; if (budget === "1000") return level <= 2; if (budget === "2000") return level <= 3; return true; }
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const ONBOARDING = [
    { emoji: "🏃", title: "Time to skedaddle.", body: "Weekend escape inspiration from Sydney, powered by AI. Find your perfect getaway in seconds.", accent: "#56c88c" },
    { emoji: "✨", title: "Tell us your vibe.", body: "Cabin in the mountains? Beach escape? Hidden gem? Pick your style and we'll handle the rest.", accent: "#ffc850" },
    { emoji: "📍", title: "Real destinations.", body: "Claude suggests destinations based on your dates, group, and the season. Fresh ideas every time.", accent: "#b088ff" },
    { emoji: "✈️", title: "One tap to book.", body: "Every destination links straight to Airbnb and Stayz with your dates pre-filled.", accent: "#56c88c" },
];
// ── DEMO MODE ─────────────────────────────────────────────────
const DEMO_MODE = false; // Flip to false when your API key is active
// Set to your Cloudflare Worker URL to enable web search + secure API key storage.
// Leave empty to call Anthropic directly from the browser (no web search).
const WORKER_URL = ""; // e.g. "https://skedaddle-worker.yourname.workers.dev"
const MOCK_RESULTS = [
    { destination: "Kangaroo Valley", emoji: "🌿", distance_from_sydney: "2.5 hrs drive",
        why_go: "One of NSW's most jaw-dropping valleys. In winter the mist sits low over the escarpment and the forest feels genuinely remote. Perfect for couples who want a fire, a book, and nothing else.",
        best_for: ["cosy", "off-grid", "scenic drive"],
        insider_tip: "Stay south of the village near Fitzroy Falls for the quietest and most dramatic views.",
        things_to_do: ["Hike to Fitzroy Falls lookout", "Kayak the Kangaroo River", "Visit Hampden Bridge", "Breakfast at The Riverwood Pantry"],
        whats_on: "Winter Lantern Festival at Fitzroy Falls Reserve — Saturday night only" },
    { destination: "Jervis Bay", emoji: "🏖️", distance_from_sydney: "3 hrs drive",
        why_go: "Home to the whitest sand in the world and water so clear it looks fake. The bay is sheltered and swimmable year-round, even in winter when the crowds disappear entirely.",
        best_for: ["beach", "snorkelling", "family"],
        insider_tip: "Stay in Hyams Beach and walk north at low tide to find completely empty coves.",
        things_to_do: ["Snorkel at Greenfield Beach", "Dolphin watching cruise", "Walk to Steamers Beach", "Oysters at the wharf in Huskisson"],
        whats_on: "Huskisson Seaside Markets — every Sunday morning" },
    { destination: "Blue Mountains", emoji: "🌲", distance_from_sydney: "2 hrs drive",
        why_go: "Dramatic sandstone cliffs, endless bushwalking, and cosy village cafes with open fires. Katoomba and Leura are both within 10 minutes of each other and feel worlds apart from the city.",
        best_for: ["hiking", "views", "weekend escape"],
        insider_tip: "Skip the Three Sisters at midday. Go at sunrise — you will have the Giant Stairway to yourself.",
        things_to_do: ["Walk the Giant Stairway", "Jenolan Caves tour", "Browse galleries in Leura", "Scenic World Skyway ride"],
        whats_on: "Leura Garden Festival runs all weekend — rare private gardens open to the public" },
    { destination: "Hunter Valley", emoji: "🍷", distance_from_sydney: "2.5 hrs drive",
        why_go: "Australia's oldest wine region and still one of its best. Autumn turns the vines gold and the cellar doors are quiet enough to actually have a conversation with the winemaker.",
        best_for: ["wine", "foodie", "romantic"],
        insider_tip: "Visit Brokenwood Wines on a weekday — no tour buses, and they pour wines not available online.",
        things_to_do: ["Wine tasting at Tyrrell's", "Cheese at Binnorie Dairy", "Hot air balloon at sunrise", "Cooking class at Tuscany Wine Estate"],
        whats_on: "Hunter Valley Wine & Food Month — special cellar door tastings all week" },
    { destination: "Bega Valley", emoji: "🧀", distance_from_sydney: "4 hrs drive",
        why_go: "The forgotten stretch of the NSW south coast. Rolling green hills, boutique cheesemakers, quiet surf beaches and barely any tourists. Feels more like rural Ireland than Australia.",
        best_for: ["hidden gem", "slow travel", "foodie"],
        insider_tip: "The Bega Co-op factory tour is free and genuinely fascinating — and you leave with cheese.",
        things_to_do: ["Tour Bega Cheese Heritage Centre", "Surf at Tathra Beach", "Walk Mimosa Rocks National Park", "Dinner at Oaklands in Cobargo"],
        whats_on: "Cobargo Folk Festival warm-up gig at the pub Friday night" },
    { destination: "Mudgee", emoji: "🍇", distance_from_sydney: "3.5 hrs drive",
        why_go: "A slower, more intimate version of the Hunter Valley. Excellent food scene, small-batch wineries, and a beautifully preserved colonial town centre that feels unchanged since the 1890s.",
        best_for: ["wine", "heritage", "relaxed"],
        insider_tip: "Lowe Wines makes some of the best organic wines in Australia — book their table under the vines.",
        things_to_do: ["Wine trail along Henry Lawson Drive", "Explore Gulgong", "Saturday farmers market", "Honey tasting at Robert Oatley Vineyards"],
        whats_on: "Mudgee Small Farm Field Days — ag shows, live music, local produce all weekend" },
];
function getMockResults() {
    return new Promise(function (resolve) { setTimeout(function () { resolve(MOCK_RESULTS); }, 1400); });
}
function buildAirbnbUrl(dest, ci, co, guests, pet) {
    const p = new URLSearchParams({ query: dest + ", NSW, Australia", checkin: ci, checkout: co, adults: guests, refinement_paths: "/homes", search_type: "filter_change" });
    if (pet)
        p.set("amenities[]", "25");
    return `https://www.airbnb.com.au/s/${encodeURIComponent(dest + ", NSW")}/homes?${p}`;
}
function buildStayzUrl(dest, ci, co, guests, pet) {
    const p = new URLSearchParams({ q: dest + " NSW", arrival: ci, departure: co, adults: guests });
    if (pet)
        p.set("pets", "1");
    return `https://www.stayz.com.au/accommodation?${p}`;
}
function formatDate(d) { return d.toISOString().split("T")[0]; }
function getNextWeekend() {
    const t = new Date(), df = (5 - t.getDay() + 7) % 7 || 7;
    const fri = new Date(t);
    fri.setDate(t.getDate() + df);
    const sun = new Date(fri);
    sun.setDate(fri.getDate() + 2);
    return { checkIn: formatDate(fri), checkOut: formatDate(sun) };
}
function getSeason() {
    const m = new Date().getMonth();
    if (m >= 2 && m <= 4)
        return { name: "autumn", emoji: "🍂", banner: "Autumn colour & crisp air", sub: "Perfect for wine country & mountain drives" };
    if (m >= 5 && m <= 7)
        return { name: "winter", emoji: "🔥", banner: "Winter cabin season is here", sub: "Log fires, misty valleys & cosy stays" };
    if (m >= 8 && m <= 10)
        return { name: "spring", emoji: "🌸", banner: "Spring is popping off", sub: "Wildflowers, warm days & outdoor escapes" };
    return { name: "summer", emoji: "☀️", banner: "Summer escape time", sub: "Beaches, waterfalls & long evenings" };
}
const ls = {
    get: (k, fb) => { try {
        const v = localStorage.getItem(k);
        return v !== null ? JSON.parse(v) : fb;
    }
    catch (_a) {
        return fb;
    } },
    set: (k, v) => { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (_a) { } },
    str: (k, fb) => { try {
        return localStorage.getItem(k) || fb;
    }
    catch (_a) {
        return fb;
    } },
    setStr: (k, v) => { try {
        localStorage.setItem(k, v);
    }
    catch (_a) { } },
    del: (k) => { try {
        localStorage.removeItem(k);
    }
    catch (_a) { } },
};
const BG = { minHeight: "100vh", background: "linear-gradient(160deg,#0f1a2e 0%,#0d1f1a 50%,#0a1510 100%)", fontFamily: "'DM Sans',sans-serif", color: "#f0ede6", position: "relative", overflowX: "hidden" };
const PAGE = { maxWidth: 480, margin: "0 auto", padding: "60px 24px 100px", position: "relative", zIndex: 1 };
const NAV = { position: "fixed", bottom: 0, left: 0, right: 0, paddingBottom: 8, paddingTop: 10, paddingLeft: 16, paddingRight: 16, background: "rgba(10,21,16,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between" };
function Orbs() {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { style: { position: "fixed", top: "-15%", right: "-8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,80,0.1) 0%,transparent 70%)", pointerEvents: "none" } }),
        React.createElement("div", { style: { position: "fixed", bottom: "-12%", left: "-8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(86,200,140,0.09) 0%,transparent 70%)", pointerEvents: "none" } }));
}
function NavBar({ left, center, right }) {
    return React.createElement("div", { style: NAV },
        React.createElement("div", { style: { flex: 1, display: "flex", justifyContent: "flex-start" } }, left || null),
        React.createElement("div", { style: { flex: 1, display: "flex", justifyContent: "center" } }, center || null),
        React.createElement("div", { style: { flex: 1, display: "flex", justifyContent: "flex-end" } }, right || null));
}
function NavBtn({ onClick, accent, children }) {
    return React.createElement("button", { onClick: onClick, style: { background: accent ? "linear-gradient(135deg,#56c88c,#2ea868)" : "rgba(255,255,255,0.06)", border: accent ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", color: accent ? "#071a10" : "#9a958f", fontSize: 14, fontWeight: 700, cursor: "pointer", minWidth: 80, textAlign: "center", fontFamily: "'DM Sans',sans-serif" } }, children);
}
function SavedBadge({ count, onClick }) {
    return React.createElement("button", { onClick: onClick, style: { background: count > 0 ? "rgba(255,200,80,0.12)" : "rgba(255,255,255,0.06)", border: count > 0 ? "1px solid rgba(255,200,80,0.28)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", color: count > 0 ? "#ffc850" : "#7a7570", fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" } },
        "\u2B50 ",
        count > 0 ? `${count} saved` : "Saved");
}
function OptionCard({ selected, onClick, horizontal, children }) {
    return React.createElement("button", { onClick: onClick, style: { padding: horizontal ? "14px 16px" : "16px 12px", borderRadius: 13, background: selected ? "rgba(86,200,140,0.13)" : "rgba(255,255,255,0.04)", border: selected ? "1px solid rgba(86,200,140,0.45)" : "1px solid rgba(255,255,255,0.08)", color: selected ? "#56c88c" : "#9a958f", cursor: "pointer", display: "flex", flexDirection: horizontal ? "row" : "column", alignItems: "center", gap: horizontal ? 14 : 8, textAlign: "left", width: "100%", fontFamily: "'DM Sans',sans-serif" } }, children);
}
function Section({ label, children }) {
    return React.createElement("div", { style: { marginBottom: 26 } },
        React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.18em", color: "#56c88c", textTransform: "uppercase", marginBottom: 13, fontWeight: 700 } }, label),
        children);
}
function OnboardingScreen({ onDone }) {
    const [slide, setSlide] = useState(0);
    const cur = ONBOARDING[slide], isLast = slide === ONBOARDING.length - 1;
    return React.createElement("div", { style: BG },
        React.createElement(Orbs, null),
        React.createElement("div", { style: { maxWidth: 480, margin: "0 auto", padding: "0 24px", minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: 60 } },
            React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: 8 } },
                React.createElement("button", { onClick: onDone, style: { background: "none", border: "none", color: "#5a5550", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" } }, "Skip")),
            React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 40 } },
                React.createElement("div", { style: { fontSize: 72, marginBottom: 32, lineHeight: 1 } }, cur.emoji),
                React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 24 } }, ONBOARDING.map((_, i) => React.createElement("div", { key: i, style: { height: 3, borderRadius: 2, width: i === slide ? 24 : 8, background: i === slide ? cur.accent : "rgba(255,255,255,0.15)", transition: "all 0.25s" } }))),
                React.createElement("h1", { style: { fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(32px,9vw,46px)", lineHeight: 1.05, margin: "0 0 16px", color: "#f8f4ee", letterSpacing: "-0.02em" } }, cur.title),
                React.createElement("p", { style: { fontSize: 16, color: "#7a7570", lineHeight: 1.75, margin: 0, maxWidth: 340 } }, cur.body)),
            React.createElement("div", { style: { paddingBottom: 48 } },
                React.createElement("button", { onClick: () => isLast ? onDone() : setSlide(s => s + 1), style: { width: "100%", padding: 18, borderRadius: 16, background: `linear-gradient(135deg,${cur.accent},${cur.accent}cc)`, color: "#071a10", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" } }, isLast ? "Let's go 🏃 →" : "Next →"),
                isLast && React.createElement("div", { style: { marginTop: 16, padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, fontSize: 12, color: "#6a6560", lineHeight: 1.7, textAlign: "center" } },
                    "You'll need a free Anthropic API key to power the search. Add it anytime in ",
                    React.createElement("strong", { style: { color: "#c8c3b8" } }, "\u2699\uFE0F Settings"),
                    "."))));
}
function SettingsScreen({ currentKey, onSave, onBack }) {
    const [hasKey, setHasKey] = useState(!!currentKey);
    const [key, setKey] = useState("");
    const [error, setError] = useState("");
    const [testing, setTesting] = useState(false);
    const [saved, setSaved] = useState(false);
    const [editing, setEditing] = useState(!currentKey);
    async function handleSave() {
        const t = key.trim();
        if (!t.startsWith("sk-ant-")) {
            setError("Keys start with sk-ant- — check and try again.");
            return;
        }
        setTesting(true);
        setError("");
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": t, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }) });
            if (res.status === 401) {
                setError("Invalid key — double-check and try again.");
                setTesting(false);
                return;
            }
            ls.setStr("skedaddle_apikey", t);
            onSave(t);
            setEditing(false);
            setHasKey(true);
            setSaved(true);
            setKey("");
        }
        catch (_a) {
            setError("Couldn't reach Anthropic — check your connection.");
        }
        setTesting(false);
    }
    function handleRemove() {
        if (!window.confirm("Remove your API key?"))
            return;
        ls.del("skedaddle_apikey");
        onSave("");
        setHasKey(false);
        setEditing(true);
        setSaved(false);
        setKey("");
        setError("");
    }
    function clearData(type) {
        const labels = { favs: "saved places", been: "been there list", history: "search history" };
        if (!window.confirm(`Clear your ${labels[type]}?`))
            return;
        ls.del(`skedaddle_${type}`);
        window.location.reload();
    }
    const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: 22, marginBottom: 14 };
    return React.createElement("div", { style: BG },
        React.createElement(Orbs, null),
        React.createElement("div", { style: PAGE },
            React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.2em", color: "#ffc850", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 } }, "Settings"),
            React.createElement("h2", { style: { fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 900, margin: "0 0 32px", color: "#f8f4ee", letterSpacing: "-0.02em" } }, "Your preferences"),
            React.createElement("div", { style: card },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 } }, "Anthropic API Key"),
                        React.createElement("div", { style: { fontSize: 13, color: "#6a6560" } }, "Powers the AI search")),
                    hasKey && !editing && React.createElement("button", { onClick: () => { setKey(""); setEditing(true); setSaved(false); setError(""); }, style: { background: "rgba(86,200,140,0.1)", border: "1px solid rgba(86,200,140,0.25)", borderRadius: 10, padding: "6px 12px", color: "#56c88c", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" } }, "Change")),
                hasKey && !editing && React.createElement(React.Fragment, null,
                    saved && React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "rgba(86,200,140,0.08)", border: "1px solid rgba(86,200,140,0.2)", marginBottom: 10 } },
                        React.createElement("span", { style: { color: "#56c88c", fontSize: 16 } }, "\u2713"),
                        React.createElement("span", { style: { fontSize: 13, color: "#56c88c", fontWeight: 600 } }, "Key saved and verified")),
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                        React.createElement("div", { style: { flex: 1, padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 14, color: "#c8c3b8", fontFamily: "monospace" } }, "sk-ant-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"),
                        React.createElement("button", { onClick: handleRemove, style: { padding: "11px 14px", borderRadius: 10, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.18)", color: "#ff8080", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" } }, "Remove"))),
                editing && React.createElement(React.Fragment, null,
                    React.createElement("input", { type: "password", placeholder: "sk-ant-api03-...", value: key, autoFocus: true, onChange: e => { setKey(e.target.value); setError(""); }, style: { width: "100%", padding: "12px 14px", borderRadius: 11, background: "rgba(255,255,255,0.05)", border: error ? "1px solid rgba(255,80,80,0.5)" : "1px solid rgba(255,255,255,0.12)", color: "#f0ede6", fontSize: 14, outline: "none", marginBottom: error ? 8 : 10, fontFamily: "'DM Sans',sans-serif" } }),
                    error && React.createElement("div", { style: { fontSize: 12, color: "#ff6060", marginBottom: 10, lineHeight: 1.5 } },
                        "\u26A0\uFE0F ",
                        error),
                    React.createElement("div", { style: { display: "flex", gap: 8 } },
                        React.createElement("button", { onClick: handleSave, disabled: !key.trim() || testing, style: { flex: 1, padding: 11, borderRadius: 10, background: key.trim() && !testing ? "linear-gradient(135deg,#56c88c,#2ea868)" : "rgba(255,255,255,0.06)", color: key.trim() && !testing ? "#071a10" : "#444", border: "none", cursor: key.trim() && !testing ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif" } }, testing ? "Verifying..." : "Save key"),
                        hasKey && React.createElement("button", { onClick: () => { setEditing(false); setKey(""); setError(""); }, style: { padding: "11px 16px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9a958f", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" } }, "Cancel")),
                    error && React.createElement("button", { onClick: () => { setKey(""); setError(""); }, style: { marginTop: 10, width: "100%", padding: 10, borderRadius: 10, background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.15)", color: "#ff8080", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" } }, "Clear and try a different key")),
                React.createElement("div", { style: { marginTop: 12, fontSize: 12, color: "#5a5550", lineHeight: 1.6 } },
                    "\uD83D\uDD12 Stored on this device only. ",
                    React.createElement("a", { href: "https://console.anthropic.com/keys", target: "_blank", style: { color: "#56c88c", textDecoration: "none" } }, "Get a key \u2192"))),
            React.createElement("div", { style: card },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 16 } }, "Data & Storage"),
                [{ k: "favs", label: "Saved places", icon: "⭐", desc: "Your bolthole list" }, { k: "been", label: "Been there list", icon: "📍", desc: "Places you've visited" }, { k: "history", label: "Search history", icon: "🕓", desc: "Your last 3 searches" }].map(item => (React.createElement("div", { key: item.k, style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 } },
                    React.createElement("span", { style: { fontSize: 18, width: 28, textAlign: "center", flexShrink: 0 } }, item.icon),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#c8c3b8" } }, item.label),
                        React.createElement("div", { style: { fontSize: 11, color: "#5a5550" } }, item.desc)),
                    React.createElement("button", { onClick: () => clearData(item.k), style: { padding: "6px 12px", borderRadius: 9, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.18)", color: "#ff8080", fontSize: 11, cursor: "pointer", fontWeight: 600, flexShrink: 0, fontFamily: "'DM Sans',sans-serif" } }, "Clear"))))),
            React.createElement("div", { style: card },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 14 } }, "About"),
                [{ label: "App", value: "Skedaddle" }, { label: "Version", value: "1.5.0" }, { label: "Model", value: "claude-sonnet-4-6" }].map(row => (React.createElement("div", { key: row.label, style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" } },
                    React.createElement("span", { style: { fontSize: 13, color: "#6a6560" } }, row.label),
                    React.createElement("span", { style: { fontSize: 13, color: "#c8c3b8", fontWeight: 600 } }, row.value)))))),
        React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: onBack }, "\u2190 Back") }));
}
function DestCard({ dest, index, checkIn, checkOut, guests, pet, group, budget, favs, been, onFav, onDetail }) {
    const [visible, setVisible] = useState(false);
    const isFav = favs.some(f => f.destination === dest.destination);
    const visited = been.includes(dest.destination);
    const shownBudget = dest.typical_budget || ((group === "family" || group === "friends") ? dest.budget_family : dest.budget_couple) || lookupBudget(dest).family;
    const money = dest.typical_budget || ((group === "family" || group === "friends") ? dest.budget_family : dest.budget_couple) || lookupBudget(dest).family;
    const gem = dest.gem_type || lookupBudget(dest).type;
    useEffect(() => { const t = setTimeout(() => setVisible(true), index * 100); return () => clearTimeout(t); }, []);
    const accent = visited ? "linear-gradient(90deg,#b088ff,#7c50e8)" : isFav ? "linear-gradient(90deg,#ffc850,#ff8c30)" : "linear-gradient(90deg,#56c88c,#2ea868)";
    const bg = visited ? "rgba(168,120,255,0.04)" : isFav ? "rgba(255,200,80,0.04)" : "rgba(255,255,255,0.035)";
    const border = visited ? "1px solid rgba(168,120,255,0.2)" : isFav ? "1px solid rgba(255,200,80,0.3)" : "1px solid rgba(255,255,255,0.09)";
    return React.createElement("div", { onClick: () => onDetail(dest), style: { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)", background: bg, border, borderRadius: 22, padding: 22, display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden", cursor: "pointer" } },
        React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent } }),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" } },
                    React.createElement("span", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase" } }, dest.distance_from_sydney),
                    pet && React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,200,80,0.15)", color: "#ffc850", border: "1px solid rgba(255,200,80,0.3)", fontWeight: 700 } }, "\uD83D\uDC3E Pet friendly"),
                    visited && React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(168,120,255,0.15)", color: "#b088ff", border: "1px solid rgba(168,120,255,0.3)", fontWeight: 700 } }, "\u2713 Been here"),
                    React.createElement("span", { style: { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: gem === "Hidden Gem" ? "rgba(86,200,140,0.12)" : "rgba(255,255,255,0.06)", color: gem === "Hidden Gem" ? "#56c88c" : "#c8c3b8", border: gem === "Hidden Gem" ? "1px solid rgba(86,200,140,0.25)" : "1px solid rgba(255,255,255,0.12)", fontWeight: 700 } }, gem)),
                React.createElement("h3", { style: { margin: 0, fontSize: 21, fontWeight: 900, color: "#f8f4ee", fontFamily: "'Fraunces',serif", lineHeight: 1.15 } }, dest.destination)),
            React.createElement("div", { style: { display: "flex", gap: 6, marginLeft: 10, flexShrink: 0, alignItems: "center" } },
                React.createElement("span", { style: { fontSize: 24 } }, dest.emoji),
                React.createElement("button", { onClick: e => { e.stopPropagation(); onFav(dest); }, style: { width: 32, height: 32, borderRadius: 9, border: "none", background: isFav ? "rgba(255,200,80,0.18)" : "rgba(255,255,255,0.06)", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" } }, isFav ? "⭐" : "☆"))),
        React.createElement("p", { style: { margin: 0, fontSize: 14, color: "#b0aba4", lineHeight: 1.7 } }, dest.why_go),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
            React.createElement("span", { style: { fontSize: 12, padding: "6px 10px", borderRadius: 12, background: "rgba(255,200,80,0.08)", color: "#ffc850", border: "1px solid rgba(255,200,80,0.2)", fontWeight: 700 } }, "💰 Typical weekend: ", money),
            React.createElement("span", { style: { fontSize: 12, padding: "6px 10px", borderRadius: 12, background: "rgba(86,200,140,0.08)", color: "#56c88c", border: "1px solid rgba(86,200,140,0.18)", fontWeight: 700 } }, gem)),
        React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, (dest.best_for || []).map(tag => React.createElement("span", { key: tag, style: { fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "rgba(86,200,140,0.1)", color: "#56c88c", border: "1px solid rgba(86,200,140,0.22)" } }, tag))),
        dest.whats_on && (React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 9, padding: "10px 13px", background: "rgba(176,136,255,0.09)", border: "1px solid rgba(176,136,255,0.22)", borderRadius: 12 } },
            React.createElement("span", { style: { fontSize: 14, flexShrink: 0, marginTop: 1 } }, "\uD83D\uDCC5"),
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 10, letterSpacing: "0.12em", color: "#b088ff", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 } }, "This weekend"),
                React.createElement("div", { style: { fontSize: 13, color: "#d0c8f0", lineHeight: 1.5 } }, dest.whats_on)))),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 } },
            React.createElement("span", { style: { fontSize: 12, color: "#5a5550", fontStyle: "italic" } }, "Tap for details & map"),
            React.createElement("span", { style: { fontSize: 13, color: "#56c88c", fontWeight: 700 } }, "View \u2192")));
}
function DetailScreen({ dest, checkIn, checkOut, guests, pet, group, budget, favs, been, onFav, onBeen, onBack }) {
    const [shareState, setShareState] = useState(null);
    const isFav = favs.some(f => f.destination === dest.destination);
    const visited = been.includes(dest.destination);
    async function doShare() {
        const url = buildAirbnbUrl(dest.destination, checkIn, checkOut, guests, pet);
        const text = `${dest.emoji} ${dest.destination} — ${dest.distance_from_sydney} from Sydney\n\n${dest.why_go}\n\n💡 ${dest.insider_tip}\n\nAirbnb: ${url}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Skedaddle to ${dest.destination}`, text });
                setShareState("shared");
                setTimeout(() => setShareState(null), 2000);
            }
            catch (_a) { }
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            setShareState("copied");
            setTimeout(() => setShareState(null), 2200);
        }
        catch (_b) { }
    }
    return React.createElement("div", { style: BG },
        React.createElement(Orbs, null),
        React.createElement("div", { style: PAGE },
            React.createElement("div", { style: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 22, padding: 28, marginBottom: 14, position: "relative", overflow: "hidden" } },
                React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#56c88c,#2ea868)" } }),
                React.createElement("div", { style: { fontSize: 52, marginBottom: 12 } }, dest.emoji),
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 } }, dest.distance_from_sydney),
                React.createElement("h2", { style: { fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 34, margin: "0 0 14px", color: "#f8f4ee", letterSpacing: "-0.02em", lineHeight: 1.1 } }, dest.destination),
                React.createElement("p", { style: { margin: "0 0 14px", fontSize: 15, color: "#b0aba4", lineHeight: 1.75 } }, dest.why_go),
                React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap" } }, (dest.best_for || []).map(tag => React.createElement("span", { key: tag, style: { fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "rgba(86,200,140,0.1)", color: "#56c88c", border: "1px solid rgba(86,200,140,0.22)" } }, tag)))),
            React.createElement("div", { style: { background: "rgba(255,200,80,0.06)", border: "1px solid rgba(255,200,80,0.2)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#ffc850", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 } }, "Typical weekend budget"),
                React.createElement("div", { style: { fontSize: 22, color: "#f8f4ee", fontWeight: 900, marginBottom: 6 } }, shownBudget),
                React.createElement("div", { style: { fontSize: 13, color: "#9a958f", lineHeight: 1.5 } }, "Rough planning range for accommodation, fuel, meals and one paid activity. Not a live quote.")),
            dest.why_picked && React.createElement("div", { style: { background: "rgba(86,200,140,0.06)", border: "1px solid rgba(86,200,140,0.18)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 } }, "Why we picked this"),
                React.createElement("p", { style: { margin: 0, fontSize: 14, color: "#c8c3b4", lineHeight: 1.7 } }, dest.why_picked)),
            dest.whats_on && React.createElement("div", { style: { background: "rgba(176,136,255,0.08)", border: "1px solid rgba(176,136,255,0.25)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } },
                    React.createElement("span", { style: { fontSize: 18 } }, "\uD83D\uDCC5"),
                    React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#b088ff", fontWeight: 700, textTransform: "uppercase" } }, "What's on this weekend")),
                React.createElement("p", { style: { margin: 0, fontSize: 14, color: "#d0c8f0", lineHeight: 1.7 } }, dest.whats_on)),
            dest.insider_tip && React.createElement("div", { style: { background: "rgba(255,200,80,0.06)", border: "1px solid rgba(255,200,80,0.2)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#ffc850", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 } }, "Insider tip"),
                React.createElement("p", { style: { margin: 0, fontSize: 14, color: "#c8c3b4", lineHeight: 1.7, fontStyle: "italic" } },
                    "\uD83D\uDCA1 ",
                    dest.insider_tip)),
            dest.things_to_do && dest.things_to_do.length > 0 && React.createElement("div", { style: { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 18px", marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.15em", color: "#56c88c", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 } }, "Things to do"),
                dest.things_to_do.map((t, i) => React.createElement("div", { key: i, style: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 } },
                    React.createElement("span", { style: { color: "#56c88c", fontWeight: 700, fontSize: 13, flexShrink: 0 } }, "\u2192"),
                    React.createElement("span", { style: { fontSize: 14, color: "#b0aba4", lineHeight: 1.5 } }, t)))),
            React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 10 } },
                React.createElement("button", { onClick: () => onFav(dest), style: { flex: 1, padding: 14, borderRadius: 13, border: "none", background: isFav ? "rgba(255,200,80,0.15)" : "rgba(255,255,255,0.06)", color: isFav ? "#ffc850" : "#9a958f", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif" } }, isFav ? "⭐ Saved" : "☆ Save"),
                React.createElement("button", { onClick: () => onBeen(dest.destination), style: { flex: 1, padding: 14, borderRadius: 13, border: "none", background: visited ? "rgba(168,120,255,0.15)" : "rgba(255,255,255,0.06)", color: visited ? "#b088ff" : "#9a958f", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans',sans-serif" } }, visited ? "✓ Been there" : "📍 Been there?"),
                React.createElement("button", { onClick: doShare, style: { width: 50, padding: 14, borderRadius: 13, border: "none", background: shareState ? "rgba(86,200,140,0.15)" : "rgba(255,255,255,0.06)", color: shareState ? "#56c88c" : "#9a958f", cursor: "pointer", fontSize: 16, fontFamily: "'DM Sans',sans-serif" } }, shareState === "copied" ? "✓" : "↗")),
            shareState === "copied" && React.createElement("div", { style: { fontSize: 12, color: "#56c88c", textAlign: "right", marginBottom: 10 } }, "Copied!"),
            React.createElement("a", { href: `https://maps.google.com/?q=${encodeURIComponent(dest.destination + ", NSW, Australia")}`, target: "_blank", style: { display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13, color: "#9a958f", fontSize: 14, fontWeight: 600, marginBottom: 12, textDecoration: "none" } },
                React.createElement("span", { style: { fontSize: 18 } }, "\uD83D\uDDFA\uFE0F"),
                React.createElement("span", null, "Open in Google Maps"),
                React.createElement("span", { style: { marginLeft: "auto", opacity: 0.5 } }, "\u2192")),
            React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
                React.createElement("a", { href: buildAirbnbUrl(dest.destination, checkIn, checkOut, guests, pet), target: "_blank", style: { display: "block", textAlign: "center", padding: 15, background: "linear-gradient(135deg,#56c88c,#2ea868)", color: "#071a10", borderRadius: 13, fontWeight: 700, fontSize: 14, textDecoration: "none" } }, "Airbnb \u2192"),
                React.createElement("a", { href: buildStayzUrl(dest.destination, checkIn, checkOut, guests, pet), target: "_blank", style: { display: "block", textAlign: "center", padding: 15, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", color: "#f0ede6", borderRadius: 13, fontWeight: 700, fontSize: 14, textDecoration: "none" } }, "Stayz \u2192"))),
        React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: onBack }, "\u2190 Results") }));
}
function SavedScreen({ favs, been, onFav, onBeen, onBack, onSettings, onDetail }) {
    const nw = getNextWeekend();
    return React.createElement("div", { style: BG },
        React.createElement(Orbs, null),
        React.createElement("div", { style: PAGE },
            React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.2em", color: "#ffc850", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 } }, "Saved spots"),
            React.createElement("h2", { style: { fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, margin: "0 0 6px", color: "#f8f4ee", letterSpacing: "-0.02em" } }, "Your bolthole list"),
            React.createElement("p", { style: { fontSize: 14, color: "#7a7570", margin: "0 0 28px" } }, favs.length === 0 ? "Nothing saved yet — star a destination." : `${favs.length} place${favs.length !== 1 ? "s" : ""} on your list`),
            React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } }, favs.map((dest, i) => React.createElement(DestCard, { key: dest.destination, dest: dest, index: i, checkIn: nw.checkIn, checkOut: nw.checkOut, guests: 2, pet: false, group: "couple", budget: "any", favs: favs, been: been, onFav: onFav, onDetail: onDetail })))),
        React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: onBack }, "\u2190 Back"), right: React.createElement(NavBtn, { onClick: onSettings }, "\u2699\uFE0F Settings") }));
}
function App() {
    const [screen, setScreen] = useState("home");
    const [prevScreen, setPrev] = useState("home");
    const [detailDest, setDetail] = useState(null);
    const [detailBack, setDetailBack] = useState("results");
    const [vibe, setVibe] = useState(null);
    const [distance, setDist] = useState("3");
    const [group, setGroup] = useState("couple");
    const nw = getNextWeekend();
    const [checkIn, setCI] = useState(nw.checkIn);
    const [checkOut, setCO] = useState(nw.checkOut);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [statusMsg, setStatus] = useState("");
    const [pet, setPet] = useState(false);
    const [budget, setBudget] = useState("any");
    const [apiKey, setApiKey] = useState(() => ls.str("skedaddle_apikey", ""));
    const [onboarded, setOnboarded] = useState(() => ls.get("skedaddle_onboarded", false));
    const [favs, setFavs] = useState(() => ls.get("skedaddle_favs", []));
    const [been, setBeen] = useState(() => ls.get("skedaddle_been", []));
    const [history, setHistory] = useState(() => ls.get("skedaddle_history", []));
    const season = getSeason();
    const selG = GROUPS.find(g => g.id === group);
    const selV = VIBES.find(v => v.id === vibe);
    function goSettings() { setPrev(screen); setScreen("settings"); }
    function toggleFav(dest) {
        const next = favs.some(f => f.destination === dest.destination) ? favs.filter(f => f.destination !== dest.destination) : [...favs, dest];
        ls.set("skedaddle_favs", next);
        setFavs(next);
    }
    function toggleBeen(name) {
        const next = been.includes(name) ? been.filter(n => n !== name) : [...been, name];
        ls.set("skedaddle_been", next);
        setBeen(next);
    }
    function surpriseMe() {
        if (!DEMO_MODE && !apiKey) { goSettings(); return; }
        const rv = randomFrom(VIBES).id, rd = randomFrom(DISTANCES).id, rg = randomFrom(GROUPS).id, rb = randomFrom(BUDGETS).id;
        setVibe(rv); setDist(rd); setGroup(rg); setBudget(rb);
        runFetch({ vibe: rv, distance: rd, group: rg, budget: rb });
    }
    async function runFetch(ov = {}) {
        const uv = ov.vibe !== undefined ? ov.vibe : vibe, ud = ov.distance !== undefined ? ov.distance : distance;
        const ug = ov.group !== undefined ? ov.group : group, uci = ov.checkIn !== undefined ? ov.checkIn : checkIn;
        const uco = ov.checkOut !== undefined ? ov.checkOut : checkOut, up = ov.pet !== undefined ? ov.pet : pet;
        const ub = ov.budget !== undefined ? ov.budget : budget;
        const vObj = VIBES.find(x => x.id === uv), gObj = GROUPS.find(x => x.id === ug);
        setLoading(true);
        setError(null);
        setResults(null);
        setScreen("results");
        const entry = { vibe: uv, distance: ud, group: ug, checkIn: uci, checkOut: uco, pet: up, budget: ub };
        const newH = [entry, ...history.filter(h => !(h.vibe === uv && h.distance === ud && h.group === ug && h.budget === ub))].slice(0, 3);
        ls.set("skedaddle_history", newH);
        setHistory(newH);
        const prompt = `You are a local Sydney travel expert. It's ${season.name} in Sydney, Australia.\n${WORKER_URL ? "Use web search to find current events and conditions for these dates." : ""}\nSuggest weekend getaway destinations:\n- Vibe: ${vObj ? vObj.label : ""}\n- Max drive: ${ud} hours\n- Group: ${gObj ? gObj.label : ""} (${gObj ? gObj.guests : 2} guests)\n- Dates: ${uci} to ${uco}\n- Pet friendly: ${up ? "YES" : "No"}\n- Budget: ${budgetLabel(ub)}\n- Skip visited: ${been.length > 0 ? been.join(", ") : "none"}\nReturn ONLY a valid JSON array of exactly 6 objects, no markdown:\n[{"destination":"Name","emoji":"e","distance_from_sydney":"X hrs drive","why_go":"2-3 sentences","best_for":["t1","t2","t3"],"insider_tip":"tip","things_to_do":["t1","t2","t3"],"whats_on":"one current local event or market happening this specific weekend, or empty string if nothing notable","budget_couple":"$500-$1000","budget_family":"$900-$1800","budget_level":2,"gem_type":"Hidden Gem or Popular Favourite","why_picked":"one sentence explaining why this matches the selected vibe, group, drive time and budget"}]`;
        setStatus("Finding your next skedaddle...");
        // Demo mode — returns mock data without hitting the API
        if (DEMO_MODE) {
            const mock = await getMockResults();
            setResults(mock.map(d => enrichDestination(d, { vibe: uv, distance: ud, group: ug, pet: up, budget: ub })).filter(d => budgetFits(d, ub)).slice(0, 6));
            setLoading(false);
            setStatus("");
            return;
        }
        try {
            // Use Worker (with web search) if configured, else call Anthropic directly
            const usingWorker = !!WORKER_URL;
            const endpoint = usingWorker ? WORKER_URL : "https://api.anthropic.com/v1/messages";
            const headers = usingWorker
                ? { "Content-Type": "application/json" }
                : { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" };
            const body = usingWorker
                ? { messages: [{ role: "user", content: prompt }] }
                : { model: "claude-sonnet-4-6", max_tokens: 2000, messages: [{ role: "user", content: prompt }] };
            const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                if (res.status === 401)
                    setError("API key rejected — check Settings.");
                else if (res.status === 429)
                    setError("Rate limit hit — wait a moment and try again.");
                else
                    setError(`API error ${res.status}: ${e && e.error && e.error.message ? e.error.message : "please try again."}`);
                setLoading(false);
                setStatus("");
                return;
            }
            const data = await res.json();
            const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
            const match = text.match(/\[[\s\S]*\]/);
            if (!match) {
                setError("Unexpected response — please try again.");
                setLoading(false);
                setStatus("");
                return;
            }
            setResults(JSON.parse(match[0]).map(d => enrichDestination(d, { vibe: uv, distance: ud, group: ug, pet: up, budget: ub })).filter(d => budgetFits(d, ub)).slice(0, 6));
        }
        catch (_a) {
            setError("Can't reach Anthropic — check your connection.");
        }
        setLoading(false);
        setStatus("");
    }
    if (!onboarded)
        return React.createElement(OnboardingScreen, { onDone: () => { ls.set("skedaddle_onboarded", true); setOnboarded(true); } });
    if (screen === "settings")
        return React.createElement(SettingsScreen, { currentKey: apiKey, onSave: k => setApiKey(k), onBack: () => setScreen(prevScreen || "home") });
    if (screen === "saved")
        return React.createElement(SavedScreen, { favs: favs, been: been, onFav: toggleFav, onBeen: toggleBeen, onBack: () => setScreen("home"), onSettings: goSettings, onDetail: (dest) => { setDetail(dest); setDetailBack("saved"); setScreen("detail"); } });
    if (screen === "detail" && detailDest)
        return React.createElement(DetailScreen, { dest: detailDest, checkIn: checkIn, checkOut: checkOut, guests: selG ? selG.guests : 2, pet: pet, group: group, budget: budget, favs: favs, been: been, onFav: toggleFav, onBeen: toggleBeen, onBack: () => setScreen(detailBack || "results") });
    if (screen === "home")
        return React.createElement("div", { style: BG },
            React.createElement(Orbs, null),
            React.createElement("div", { style: PAGE },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 } },
                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                        React.createElement("span", { style: { fontSize: 22 } }, "\uD83C\uDFC3"),
                        React.createElement("span", { style: { fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 20, color: "#f8f4ee", letterSpacing: "-0.02em" } }, "Skedaddle")),
                    React.createElement(SavedBadge, { count: favs.length, onClick: () => setScreen("saved") })),
                React.createElement("div", { style: { background: "rgba(255,200,80,0.07)", border: "1px solid rgba(255,200,80,0.2)", borderRadius: 16, padding: "16px 18px", marginBottom: 32, display: "flex", gap: 14, alignItems: "center" } },
                    React.createElement("span", { style: { fontSize: 28, flexShrink: 0 } }, season.emoji),
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontWeight: 700, fontSize: 14, color: "#ffc850", marginBottom: 3 } }, season.banner),
                        React.createElement("div", { style: { fontSize: 13, color: "#8a8070" } }, season.sub))),
                !apiKey && !DEMO_MODE && React.createElement("div", { onClick: goSettings, style: { background: "rgba(255,200,80,0.08)", border: "1px solid rgba(255,200,80,0.25)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" } },
                    React.createElement("span", { style: { fontSize: 20, flexShrink: 0 } }, "\uD83D\uDD11"),
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#ffc850", marginBottom: 2 } }, "Add your API key to get started"),
                        React.createElement("div", { style: { fontSize: 12, color: "#8a8070" } }, "Tap to open Settings")),
                    React.createElement("span", { style: { fontSize: 12, color: "#ffc850", opacity: 0.7 } }, "\u2192")),
                React.createElement("div", { style: { fontSize: 12, letterSpacing: "0.2em", color: "#ffc850", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 } }, "Weekend escapes from Sydney"),
                React.createElement("h1", { style: { fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: "clamp(44px,11vw,60px)", lineHeight: 1.0, margin: "0 0 18px", color: "#f8f4ee", letterSpacing: "-0.02em" } },
                    "Time to",
                    React.createElement("br", null),
                    React.createElement("span", { style: { color: "#56c88c" } }, "skedaddle.")),
                React.createElement("p", { style: { fontSize: 15, color: "#7a7570", lineHeight: 1.7, margin: "0 0 20px", maxWidth: 320 } }, "Tell us your vibe. We'll find where to bolt to this weekend \u2014 fresh ideas every time."),
                React.createElement("button", { onClick: surpriseMe, style: { width: "100%", padding: "15px 18px", borderRadius: 15, background: "rgba(176,136,255,0.1)", border: "1px solid rgba(176,136,255,0.25)", color: "#d8c8ff", cursor: "pointer", fontSize: 15, fontWeight: 800, fontFamily: "'DM Sans',sans-serif", marginBottom: 28 } }, "🎲 Surprise me this weekend"),
                history.length > 0 && React.createElement("div", { style: { marginBottom: 32 } },
                    React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.18em", color: "#56c88c", textTransform: "uppercase", marginBottom: 13, fontWeight: 700 } }, "Recent searches"),
                    history.map((e, i) => {
                        const v = VIBES.find(x => x.id === e.vibe), g = GROUPS.find(x => x.id === e.group);
                        return React.createElement("button", { key: i, onClick: () => { setVibe(e.vibe); setDist(e.distance); setGroup(e.group); setCI(e.checkIn); setCO(e.checkOut); setPet(e.pet || false); setBudget(e.budget || "any"); runFetch(e); }, style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" } },
                            React.createElement("span", { style: { fontSize: 22, flexShrink: 0 } }, v ? v.emoji : ""),
                            React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                                React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#c8c3b8", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } },
                                    v ? v.label : "",
                                    " \u00B7 ",
                                    e.distance,
                                    "hr \u00B7 ",
                                    g ? g.label : ""),
                                React.createElement("div", { style: { fontSize: 11, color: "#5a5550" } },
                                    e.checkIn,
                                    " \u2192 ",
                                    e.checkOut)),
                            React.createElement("span", { style: { fontSize: 13, color: "#56c88c", fontWeight: 700, flexShrink: 0 } }, "Rerun \u2192"));
                    }))),
            React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: goSettings }, "\u2699\uFE0F"), right: React.createElement(NavBtn, { onClick: () => { if (!DEMO_MODE && !apiKey) {
                        goSettings();
                        return;
                    } setScreen("filters"); }, accent: true }, DEMO_MODE ? "Let's go →" : apiKey ? "Let's go →" : "Set API key") }));
    if (screen === "filters")
        return React.createElement("div", { style: BG },
            React.createElement(Orbs, null),
            React.createElement("div", { style: PAGE },
                React.createElement("h2", { style: { fontFamily: "'Fraunces',serif", fontSize: 34, fontWeight: 900, margin: "0 0 30px", color: "#f8f4ee", letterSpacing: "-0.02em" } }, "Plan the skedaddle"),
                React.createElement(Section, { label: "When are you going?" },
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, [{ label: "Check in", val: checkIn, set: setCI }, { label: "Check out", val: checkOut, set: setCO }].map(f => (React.createElement("div", { key: f.label },
                        React.createElement("div", { style: { fontSize: 11, color: "#56c88c", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase", fontWeight: 700 } }, f.label),
                        React.createElement("input", { type: "date", value: f.val, onChange: e => f.set(e.target.value), style: { width: "100%", padding: 12, borderRadius: 11, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.11)", color: "#f0ede6", fontSize: 14, outline: "none", colorScheme: "dark" } })))))),
                React.createElement(Section, { label: "Who's coming?" },
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, GROUPS.map(g => React.createElement(OptionCard, { key: g.id, selected: group === g.id, onClick: () => setGroup(g.id) },
                        React.createElement("span", { style: { fontSize: 22 } }, g.emoji),
                        React.createElement("span", { style: { fontSize: 14, fontWeight: 600 } }, g.label))))),
                React.createElement(Section, { label: "How far will you drive?" },
                    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, DISTANCES.map(d => React.createElement(OptionCard, { key: d.id, selected: distance === d.id, onClick: () => setDist(d.id), horizontal: true },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, d.label),
                            React.createElement("div", { style: { fontSize: 12, color: "#6a6560", marginTop: 2 } }, d.desc)))))),
                React.createElement(Section, { label: "What's the vibe?" },
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, VIBES.map(v => React.createElement(OptionCard, { key: v.id, selected: vibe === v.id, onClick: () => setVibe(v.id) },
                        React.createElement("span", { style: { fontSize: 24 } }, v.emoji),
                        React.createElement("span", { style: { fontSize: 13, fontWeight: 600, textAlign: "center" } }, v.label))))),
                React.createElement(Section, { label: "What's your budget?" },
                    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, BUDGETS.map(b => React.createElement(OptionCard, { key: b.id, selected: budget === b.id, onClick: () => setBudget(b.id) },
                        React.createElement("span", { style: { fontSize: 22 } }, "💰"),
                        React.createElement("span", { style: { fontSize: 13, fontWeight: 700, textAlign: "center" } }, b.label),
                        React.createElement("span", { style: { fontSize: 11, color: "#6a6560", textAlign: "center" } }, b.desc))))),
                React.createElement(Section, { label: "Any extras?" },
                    React.createElement("button", { onClick: () => setPet(p => !p), style: { width: "100%", padding: "16px 20px", borderRadius: 14, background: pet ? "rgba(255,200,80,0.1)" : "rgba(255,255,255,0.04)", border: pet ? "1px solid rgba(255,200,80,0.4)" : "1px solid rgba(255,255,255,0.08)", color: pet ? "#ffc850" : "#9a958f", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" } },
                        React.createElement("span", { style: { fontSize: 26 } }, "\uD83D\uDC3E"),
                        React.createElement("div", { style: { textAlign: "left", flex: 1 } },
                            React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, "Bringing a pet?"),
                            React.createElement("div", { style: { fontSize: 12, opacity: 0.65, marginTop: 2 } }, "Filter for pet-friendly stays")),
                        React.createElement("div", { style: { width: 44, height: 26, borderRadius: 13, background: pet ? "#ffc850" : "rgba(255,255,255,0.1)", position: "relative", flexShrink: 0, transition: "background 0.2s" } },
                            React.createElement("div", { style: { position: "absolute", top: 3, left: pet ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" } }))))),
            React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: () => setScreen("home") }, "\u2190 Back"), right: React.createElement(NavBtn, { onClick: () => runFetch(), accent: !!vibe }, "Skedaddle! \u2728") }));
    return React.createElement("div", { style: BG },
        React.createElement(Orbs, null),
        React.createElement("div", { style: PAGE },
            React.createElement("div", { style: { marginBottom: 28 } },
                React.createElement("div", { style: { fontSize: 11, letterSpacing: "0.18em", color: "#56c88c", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 } },
                    selV ? selV.emoji : "",
                    " ",
                    selV ? selV.label : "",
                    " \u00B7 ",
                    distance,
                    "hr \u00B7 ",
                    selG ? selG.label : "",
                    pet ? " · 🐾" : "",
                    budget && budget !== "any" ? ` · ${budgetLabel(budget)}` : ""),
                React.createElement("h2", { style: { fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, margin: 0, color: "#f8f4ee", letterSpacing: "-0.02em" } }, "Time to skedaddle!"),
                DEMO_MODE && React.createElement("div", { style: { marginTop: 10, padding: "8px 14px", background: "rgba(255,200,80,0.1)", border: "1px solid rgba(255,200,80,0.25)", borderRadius: 10, fontSize: 12, color: "#ffc850" } }, "\uD83E\uDDEA Demo mode \u2014 sample destinations, no API needed"),
                !DEMO_MODE && WORKER_URL && React.createElement("div", { style: { marginTop: 10, padding: "8px 14px", background: "rgba(176,136,255,0.1)", border: "1px solid rgba(176,136,255,0.25)", borderRadius: 10, fontSize: 12, color: "#b088ff" } }, "\uD83D\uDD0D Live web search enabled")),
            loading && React.createElement("div", { style: { textAlign: "center", padding: "80px 0" } },
                React.createElement("div", { style: { fontSize: 42, marginBottom: 20, display: "inline-block", animation: "bounce 0.8s ease-in-out infinite alternate" } }, "\uD83C\uDFC3"),
                React.createElement("div", { style: { color: "#56c88c", fontSize: 14, letterSpacing: "0.1em" } }, statusMsg)),
            error && React.createElement("div", { style: { textAlign: "center", padding: "60px 0" } },
                React.createElement("div", { style: { fontSize: 32, marginBottom: 16 } }, "\uD83D\uDE05"),
                React.createElement("div", { style: { color: "#9a958f", marginBottom: 24, fontSize: 14, lineHeight: 1.6 } }, error),
                React.createElement("button", { onClick: () => runFetch(), style: { padding: "12px 28px", borderRadius: 12, background: "#56c88c", color: "#071a10", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" } }, "Try again")),
            results && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
                results.map((dest, i) => React.createElement(DestCard, { key: i, dest: dest, index: i, checkIn: checkIn, checkOut: checkOut, guests: selG ? selG.guests : 2, pet: pet, group: group, budget: budget, favs: favs, been: been, onFav: toggleFav, onDetail: d => { setDetail(d); setDetailBack("results"); setScreen("detail"); } })),
                React.createElement("button", { onClick: () => runFetch(), style: { marginTop: 8, padding: 16, borderRadius: 14, background: "rgba(86,200,140,0.08)", border: "1px solid rgba(86,200,140,0.22)", color: "#56c88c", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" } }, "\uD83C\uDFC3 Skedaddle somewhere else"))),
        React.createElement(NavBar, { left: React.createElement(NavBtn, { onClick: () => setScreen("filters") }, "\u2190 Filters"), center: React.createElement(SavedBadge, { count: favs.length, onClick: () => setScreen("saved") }), right: React.createElement(NavBtn, { onClick: goSettings }, "\u2699\uFE0F") }));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
