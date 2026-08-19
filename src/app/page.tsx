"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  categoryImages,
  ItemBadge,
  MenuItem,
  menuSectionsData,
  mostOrderedItems,
  ourSpecialityItems,
  popularQuickSearches,
  quickCravingShortcuts,
  staticPairings,
  synonymDictionary,
} from "@/data/menuData";

type SearchMatchInfo = {
  matches: boolean;
  score: number;
  highlightWords: string[];
  matchedConcept?: string;
  isTypoCorrection?: boolean;
  correctedWord?: string;
};

// Damerau-Levenshtein Edit Distance with Transposition
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost, // substitution
      );

      // Damerau transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[a.length][b.length];
}

function cleanToken(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeWords(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/['’".,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Check fuzzy similarity between two single tokens
function checkTokenFuzzyMatch(
  qToken: string,
  targetToken: string,
): { isMatch: boolean; score: number; isTypo: boolean; targetWord: string } {
  const q = cleanToken(qToken);
  const t = cleanToken(targetToken);

  if (!q || !t) {
    return { isMatch: false, score: 0, isTypo: false, targetWord: targetToken };
  }

  // 1. Exact match
  if (q === t) {
    return {
      isMatch: true,
      score: 100,
      isTypo: false,
      targetWord: targetToken,
    };
  }

  // 2. Substring / Prefix match
  if (t.startsWith(q) || (t.includes(q) && q.length >= 3)) {
    return { isMatch: true, score: 85, isTypo: false, targetWord: targetToken };
  }
  if (q.includes(t) && t.length >= 3) {
    return { isMatch: true, score: 80, isTypo: false, targetWord: targetToken };
  }

  // 3. Typo / Edit Distance match
  if (q.length >= 3 && t.length >= 3) {
    const dist = editDistance(q, t);
    const maxLen = Math.max(q.length, t.length);
    const similarity = 1 - dist / maxLen;

    const isFuzzyTypo =
      dist <= 1 || (maxLen >= 5 && dist <= 2) || similarity >= 0.66;

    if (isFuzzyTypo) {
      return {
        isMatch: true,
        score: Math.round(similarity * 75),
        isTypo: true,
        targetWord: targetToken,
      };
    }
  }

  return { isMatch: false, score: 0, isTypo: false, targetWord: targetToken };
}

function formatPrice(price: number) {
  return `₹${price}`;
}

// Veg & Non-Veg Badges
function VegBadge({ isVeg }: { isVeg: boolean }) {
  if (isVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border-2 border-emerald-600 bg-emerald-50/90 p-0.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
      </span>
    );
  }
  return (
    <span
      title="Non-Vegetarian"
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border-2 border-red-700 bg-red-50/90 p-0.5"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-700" />
    </span>
  );
}

// Item Tag Badge (BESTSELLER, POPULAR, SIGNATURE)
function ItemBadgePill({ badge }: { badge?: ItemBadge }) {
  if (!badge) return null;

  if (badge === "BESTSELLER") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-900 border border-amber-500/30">
        <span>⭐</span>
        <span>BESTSELLER</span>
      </span>
    );
  }

  if (badge === "SIGNATURE") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-950 border border-orange-500/30">
        <span>🔥</span>
        <span>SIGNATURE</span>
      </span>
    );
  }

  if (badge === "POPULAR") {
    return (
      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#baa17d]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5c3d16]">
        <span>POPULAR</span>
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#4a2a04]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4a2a04]">
      <span>CHEF&apos;S PICK</span>
    </span>
  );
}

// Highlight words in text with support for multi-token & fuzzy matched substrings
function getHighlightedParts(text: string, highlightWords: string[]): string[] {
  if (!highlightWords || highlightWords.length === 0) return [text];
  const validWords = highlightWords
    .map((w) => cleanToken(w))
    .filter((w) => w.length >= 2);
  if (validWords.length === 0) return [text];

  const pattern = validWords
    .sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  try {
    const regex = new RegExp(`(${pattern})`, "gi");
    return text.split(regex);
  } catch {
    return [text];
  }
}

function HighlightText({
  text,
  highlightWords,
}: {
  text: string;
  highlightWords: string[];
}) {
  const parts = getHighlightedParts(text, highlightWords);
  const validWords = (highlightWords || [])
    .map((w) => cleanToken(w))
    .filter((w) => w.length >= 2);

  if (parts.length <= 1 && parts[0] === text) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = validWords.some(
          (w) =>
            w.toLowerCase() === cleanToken(part) ||
            (part.length >= 3 && cleanToken(part).includes(w)),
        );

        return isMatch ? (
          <mark
            key={i}
            className="rounded-xs bg-[#e26a2c]/25 font-bold text-[#4a2a04] px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        );
      })}
    </>
  );
}

function JumpToNavBar({
  section,
  activeSubcategoryMap,
  handleSubcategoryClick,
  headerHeight,
  searchQuery,
}: {
  section: (typeof menuSectionsData)[number];
  activeSubcategoryMap: Record<string, string>;
  handleSubcategoryClick: (sectionId: string, chunk: string) => void;
  headerHeight: number;
  searchQuery: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeChunk = activeSubcategoryMap[section.id] || "All";

  // Auto-center active subcategory pill in this section's Jump Bar whenever activeChunk changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const activeEl = container.querySelector<HTMLElement>(
        '[data-active="true"]',
      );
      if (!activeEl) return;

      const containerWidth = container.clientWidth;
      const targetLeft = activeEl.offsetLeft;
      const targetWidth = activeEl.offsetWidth;

      const newScrollLeft = targetLeft - containerWidth / 2 + targetWidth / 2;

      container.scrollTo({
        left: Math.max(0, newScrollLeft),
        behavior: "smooth",
      });
    });
  }, [activeChunk]);

  if (searchQuery || !section.chunks || section.chunks.length <= 1) {
    return null;
  }

  return (
    <div
      data-jump-bar={section.id}
      style={{ top: `${headerHeight}px` }}
      className="sticky z-30 -mx-3 px-3 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 bg-[#ede7dc]/95 backdrop-blur-md shadow-xs transition-colors"
    >
      <div
        ref={containerRef}
        className="mx-auto max-w-7xl flex items-center gap-1.5 overflow-x-auto scrollbar-none"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#72512b] shrink-0 flex items-center gap-1">
          <span className="text-xs">{section.icon}</span>
          <span>Jump to:</span>
        </span>
        {section.chunks.map((chunk) => {
          const isActive = activeChunk === chunk;
          return (
            <button
              key={chunk}
              data-active={isActive}
              type="button"
              onClick={() => handleSubcategoryClick(section.id, chunk)}
              className={`shrink-0 rounded-xl border px-3 py-1 text-xs font-bold transition ${
                isActive
                  ? "border-[#4a2a04] bg-[#4a2a04] text-[#f6f0e5] shadow-xs"
                  : "border-[#baa17d]/80 bg-[#f6f0e5] text-[#5c3d16] hover:bg-[#e4d8c4]"
              }`}
            >
              {chunk}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">(
    "all",
  );
  const [activeSectionId, setActiveSectionId] =
    useState<string>("asian-kitchen");
  const [activeSubcategoryMap, setActiveSubcategoryMap] = useState<
    Record<string, string>
  >({
    "asian-kitchen": "All",
    continental: "All",
    "cafe-bites": "All",
    "drinks-desserts": "All",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();
  const topHeaderRef = useRef<HTMLElement>(null);
  const sectionNavRef = useRef<HTMLDivElement>(null);
  const subcategoryNavRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(132);
  const [isInMenuSection, setIsInMenuSection] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to shrink sticky header smoothly when scrolling down with hysteresis to prevent flickering
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && scrollY > 60) return true;
        if (prev && scrollY < 20) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to smoothly center active navigation pills in horizontal scroll containers
  const centerActivePill = useCallback(
    (container: HTMLElement | null, activeSelector: string) => {
      if (!container) return;

      requestAnimationFrame(() => {
        const activeEl = container.querySelector<HTMLElement>(activeSelector);
        if (!activeEl) return;

        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        const currentScrollLeft = container.scrollLeft;

        const relativeActiveLeft =
          activeRect.left - containerRect.left + currentScrollLeft;
        const targetScrollLeft =
          relativeActiveLeft - containerRect.width / 2 + activeRect.width / 2;

        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: "smooth",
        });
      });
    },
    [],
  );

  // Auto-center active category button
  useEffect(() => {
    if (isInMenuSection) {
      centerActivePill(sectionNavRef.current, '[data-active="true"]');
    }
  }, [activeSectionId, isInMenuSection, isScrolled, centerActivePill]);

  // Auto-center active subcategory button
  useEffect(() => {
    centerActivePill(subcategoryNavRef.current, '[data-active="true"]');
  }, [activeSectionId, activeSubcategoryMap, centerActivePill]);

  // Dynamically measure sticky header height to position sticky category headers perfectly
  useEffect(() => {
    const el = topHeaderRef.current;
    if (!el) return;

    const updateHeight = () => {
      setHeaderHeight(el.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Detect when user has scrolled down into the main menu category sections
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("asian-kitchen");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setIsInMenuSection(rect.top <= headerHeight + 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headerHeight]);

  // Keyboard shortcut listener for search (/ or Ctrl+K) and Escape for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        if (searchQuery) setSearchQuery("");
      }
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  // Scrollspy: Track active menu section & subcategories using IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Track active main sections
    menuSectionsData.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSectionId(sec.id);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Track active subcategories (category cards)
    menuSectionsData.forEach((sec) => {
      sec.categories.forEach((cat) => {
        const el = document.getElementById(`cat-${cat.id}`);
        if (!el) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSubcategoryMap((prev) => ({
                  ...prev,
                  [sec.id]: cat.chunkGroup,
                }));
              }
            });
          },
          { rootMargin: "-25% 0px -55% 0px" },
        );

        observer.observe(el);
        observers.push(observer);
      });
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Extract unique menu vocabulary for fuzzy typo resolution
  const allMenuWords = useMemo(() => {
    const words = new Set<string>();
    menuSectionsData.forEach((sec) => {
      normalizeWords(sec.label).forEach((w) => words.add(w));
      sec.categories.forEach((cat) => {
        normalizeWords(cat.name).forEach((w) => words.add(w));
        cat.items.forEach((item) => {
          normalizeWords(item.name).forEach((w) => words.add(w));
          (item.tags || [])
            .flatMap(normalizeWords)
            .forEach((w) => words.add(w));
        });
      });
    });
    return Array.from(words);
  }, []);

  // Price query detector (e.g. "under 150", "under ₹150", "< 150")
  const parsedPriceConstraint = useMemo(() => {
    const raw = searchQuery.toLowerCase();
    const match = raw.match(/(?:under|below|<|<=|max)\s*₹?\s*(\d+)/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  }, [searchQuery]);

  // Compute per-token search context with individual synonym and typo expansions
  const searchEngineContext = useMemo(() => {
    const rawQ = searchQuery.toLowerCase().trim();
    if (!rawQ) {
      return {
        tokens: [] as {
          original: string;
          expanded: string[];
          isTypo: boolean;
          correctedWord?: string;
          isSynonym: boolean;
        }[],
        rawQuery: "",
        isTypo: false,
        isSynonym: false,
        conceptExplanations: [] as string[],
        typoSuggestions: [] as string[],
      };
    }

    // Filter out price query words so they don't break textual match
    const rawTokens = normalizeWords(rawQ).filter(
      (t) =>
        !["under", "below", "max", "rs", "inr"].includes(t) && isNaN(Number(t)),
    );

    let globalIsTypo = false;
    let globalIsSynonym = false;
    const conceptExplanations = new Set<string>();
    const typoSuggestions = new Set<string>();

    const tokenContexts = rawTokens.map((token) => {
      const expanded = new Set<string>();
      expanded.add(token);
      expanded.add(cleanToken(token));

      let tokenIsTypo = false;
      let correctedWord: string | undefined;
      let tokenIsSynonym = false;

      // Direct synonym dictionary lookup
      if (synonymDictionary[token]) {
        synonymDictionary[token].forEach((term) => expanded.add(term));
        conceptExplanations.add(token);
        tokenIsSynonym = true;
        globalIsSynonym = true;
      }

      // Fuzzy check against synonym dictionary keys
      Object.keys(synonymDictionary).forEach((key) => {
        const fuzzy = checkTokenFuzzyMatch(token, key);
        if (fuzzy.isMatch) {
          expanded.add(key);
          synonymDictionary[key].forEach((term) => expanded.add(term));
          if (fuzzy.isTypo && cleanToken(token) !== cleanToken(key)) {
            tokenIsTypo = true;
            correctedWord = key;
            globalIsTypo = true;
            typoSuggestions.add(key);
          }
        }
      });

      // Fuzzy check against all menu vocabulary
      allMenuWords.forEach((word) => {
        const fuzzy = checkTokenFuzzyMatch(token, word);
        if (fuzzy.isMatch) {
          expanded.add(word);
          if (
            fuzzy.isTypo &&
            cleanToken(token) !== cleanToken(word) &&
            cleanToken(word).length >= 4
          ) {
            tokenIsTypo = true;
            correctedWord = word;
            globalIsTypo = true;
            typoSuggestions.add(word);
          }
        }
      });

      return {
        original: token,
        expanded: Array.from(expanded),
        isTypo: tokenIsTypo,
        correctedWord,
        isSynonym: tokenIsSynonym,
      };
    });

    return {
      tokens: tokenContexts,
      rawQuery: rawQ,
      isTypo: globalIsTypo,
      isSynonym: globalIsSynonym,
      conceptExplanations: Array.from(conceptExplanations),
      typoSuggestions: Array.from(typoSuggestions),
    };
  }, [searchQuery, allMenuWords]);

  // Main intelligent item matching function
  const matchItem = useMemo(() => {
    return (
      item: MenuItem,
      categoryName: string,
      sectionLabel: string,
    ): SearchMatchInfo => {
      // Effective price constraint from search query
      const effectiveMaxPrice = parsedPriceConstraint;
      if (effectiveMaxPrice !== null && item.price > effectiveMaxPrice) {
        return { matches: false, score: 0, highlightWords: [] };
      }

      const { tokens, rawQuery } = searchEngineContext;

      if (tokens.length === 0) {
        return { matches: true, score: 100, highlightWords: [] };
      }

      const cleanRawQuery = cleanToken(rawQuery);
      const cleanItemName = cleanToken(item.name);
      const lowerItemName = item.name.toLowerCase();
      const lowerRawQuery = rawQuery.toLowerCase().trim();

      const itemTokens = normalizeWords(item.name);
      const categoryTokens = normalizeWords(categoryName);
      const sectionTokens = normalizeWords(sectionLabel);
      const tagTokens = item.tags ? item.tags.flatMap(normalizeWords) : [];

      let totalScore = 0;
      const matchedHighlightWords: string[] = [];
      let detectedConcept: string | undefined;
      let isTypo = false;
      let correctedWord: string | undefined;

      // 1. Heavy score boost for exact item name phrase matches
      if (cleanItemName === cleanRawQuery) {
        totalScore += 2000;
      } else if (
        lowerRawQuery.length >= 3 &&
        lowerItemName.includes(lowerRawQuery)
      ) {
        totalScore += 1000;
      } else if (
        cleanRawQuery.length >= 3 &&
        cleanItemName.includes(cleanRawQuery)
      ) {
        totalScore += 800;
      }

      // Every query token MUST be satisfied by this item
      for (const tCtx of tokens) {
        let tokenSatisfied = false;
        let bestTokenScore = 0;
        const cleanOrig = cleanToken(tCtx.original);

        // Strict Dietary token check
        if (cleanOrig === "veg" || cleanOrig === "vegetarian") {
          if (item.isVeg) {
            tokenSatisfied = true;
            bestTokenScore = Math.max(bestTokenScore, 75);
          } else {
            return { matches: false, score: 0, highlightWords: [] };
          }
        } else if (
          cleanOrig === "nonveg" ||
          cleanOrig === "non" ||
          cleanOrig === "non-veg"
        ) {
          if (!item.isVeg) {
            tokenSatisfied = true;
            bestTokenScore = Math.max(bestTokenScore, 75);
          } else {
            return { matches: false, score: 0, highlightWords: [] };
          }
        }

        // Direct Item Name Token Match (Highest priority)
        if (!tokenSatisfied) {
          for (const iToken of itemTokens) {
            const fuzzy = checkTokenFuzzyMatch(tCtx.original, iToken);
            if (fuzzy.isMatch) {
              tokenSatisfied = true;
              const tokenScore =
                fuzzy.score === 100 ? 300 : fuzzy.score >= 80 ? 200 : 100;
              bestTokenScore = Math.max(bestTokenScore, tokenScore);
              matchedHighlightWords.push(fuzzy.targetWord);
              if (fuzzy.isTypo) {
                isTypo = true;
                correctedWord = fuzzy.targetWord;
              }
            }
          }
        }

        // Compressed Item Name Match (e.g. "periperi" vs "Peri Peri")
        if (!tokenSatisfied && cleanOrig.length >= 3) {
          if (cleanItemName.includes(cleanOrig)) {
            tokenSatisfied = true;
            bestTokenScore = Math.max(bestTokenScore, 250);
            matchedHighlightWords.push(cleanOrig);
          }
        }

        // Category / Section Token Match
        if (!tokenSatisfied) {
          const catSecTokens = [...categoryTokens, ...sectionTokens];
          for (const targetToken of catSecTokens) {
            const fuzzy = checkTokenFuzzyMatch(tCtx.original, targetToken);
            if (fuzzy.isMatch) {
              tokenSatisfied = true;
              bestTokenScore = Math.max(bestTokenScore, 80);
              break;
            }
          }
        }

        // Tags Token Match
        if (!tokenSatisfied) {
          for (const targetToken of tagTokens) {
            const fuzzy = checkTokenFuzzyMatch(tCtx.original, targetToken);
            if (fuzzy.isMatch) {
              tokenSatisfied = true;
              bestTokenScore = Math.max(bestTokenScore, 60);
              matchedHighlightWords.push(fuzzy.targetWord);
              break;
            }
          }
        }

        // Expanded synonyms specific to this token
        if (!tokenSatisfied) {
          for (const synTerm of tCtx.expanded) {
            const cleanSyn = cleanToken(synTerm);
            if (cleanSyn === "veg" || cleanSyn === "vegetarian") {
              if (item.isVeg) {
                tokenSatisfied = true;
                bestTokenScore = Math.max(bestTokenScore, 40);
                break;
              }
            } else {
              const matchedWord = [
                ...itemTokens,
                ...categoryTokens,
                ...sectionTokens,
                ...tagTokens,
              ].find((t) => {
                const cT = cleanToken(t);
                return (
                  cT === cleanSyn || (cT.length >= 4 && cT.startsWith(cleanSyn))
                );
              });
              if (matchedWord) {
                tokenSatisfied = true;
                bestTokenScore = Math.max(bestTokenScore, 40);
                detectedConcept = synTerm;
                matchedHighlightWords.push(matchedWord);
                break;
              }
            }
          }
        }

        if (!tokenSatisfied) {
          return { matches: false, score: 0, highlightWords: [] };
        }

        totalScore += bestTokenScore;
      }

      return {
        matches: totalScore > 0,
        score: totalScore,
        highlightWords: Array.from(new Set(matchedHighlightWords)),
        matchedConcept: detectedConcept,
        isTypoCorrection: isTypo,
        correctedWord,
      };
    };
  }, [searchEngineContext, parsedPriceConstraint]);

  // Filtered menu sections based on query, dietary filter, and budget filter
  const filteredSections = useMemo(() => {
    const isSearching = Boolean(searchQuery.trim());

    const result = menuSectionsData
      .map((section) => {
        const filteredCategories = section.categories
          .map((cat) => {
            const filteredItems = cat.items
              .map((item) => {
                // Dietary filter
                if (dietaryFilter === "veg" && !item.isVeg) return null;
                if (dietaryFilter === "non-veg" && item.isVeg) return null;

                const matchInfo = matchItem(item, cat.name, section.label);
                if (!matchInfo.matches) return null;

                return {
                  ...item,
                  matchInfo,
                };
              })
              .filter(Boolean) as (MenuItem & { matchInfo: SearchMatchInfo })[];

            if (isSearching) {
              // Sort items by relevance score descending so exact matches appear first
              filteredItems.sort(
                (a, b) => b.matchInfo.score - a.matchInfo.score,
              );
            } else {
              // Sort items so those with explicit photo images appear at the top,
              // and items without photo images appear down at the bottom of their category list.
              filteredItems.sort((a, b) => {
                const aHasImage = Boolean(a.image);
                const bHasImage = Boolean(b.image);
                if (aHasImage && !bHasImage) return -1;
                if (!aHasImage && bHasImage) return 1;
                return 0;
              });
            }

            const maxCategoryScore = filteredItems.reduce(
              (max, item) => Math.max(max, item.matchInfo.score),
              0,
            );

            return {
              ...cat,
              items: filteredItems,
              maxScore: maxCategoryScore,
            };
          })
          .filter((cat) => cat.items.length > 0);

        if (isSearching) {
          // Sort categories by highest item match score descending
          filteredCategories.sort((a, b) => b.maxScore - a.maxScore);
        }

        const maxSectionScore = filteredCategories.reduce(
          (max, cat) => Math.max(max, cat.maxScore),
          0,
        );

        return {
          ...section,
          categories: filteredCategories,
          maxScore: maxSectionScore,
        };
      })
      .filter((section) => section.categories.length > 0);

    if (isSearching) {
      // Sort sections by highest item match score descending
      result.sort((a, b) => b.maxScore - a.maxScore);
    }

    return result;
  }, [dietaryFilter, matchItem, searchQuery]);

  const getJumpBarHeight = (sectionId?: string): number => {
    if (searchQuery || !sectionId) return 0;
    const section = menuSectionsData.find((s) => s.id === sectionId);
    if (!section || !section.chunks || section.chunks.length <= 1) return 0;

    const jumpBarEl = document.querySelector<HTMLElement>(
      `[data-jump-bar="${sectionId}"]`,
    );
    return jumpBarEl ? jumpBarEl.offsetHeight : 48;
  };

  const scrollToSection = (id: string) => {
    setIsDrawerOpen(false);
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const effectiveHeader = isScrolled
        ? headerHeight
        : Math.max(80, headerHeight - 26);
      const yOffset = -effectiveHeader - 16; // account for sticky top header height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setIsDrawerOpen(false);
    const cleanCatId = categoryId.replace(/^cat-/, "");

    let targetSectionId: string | null = null;
    let targetChunk: string | null = null;

    for (const sec of menuSectionsData) {
      const cat = sec.categories.find((c) => c.id === cleanCatId);
      if (cat) {
        targetSectionId = sec.id;
        targetChunk = cat.chunkGroup;
        break;
      }
    }

    if (targetSectionId && targetChunk) {
      setActiveSectionId(targetSectionId);
      setActiveSubcategoryMap((prev) => ({
        ...prev,
        [targetSectionId!]: targetChunk!,
      }));
    }

    const element = document.getElementById(categoryId);
    if (element) {
      const jumpBarHeight = targetSectionId
        ? getJumpBarHeight(targetSectionId)
        : 0;

      const effectiveHeader = isScrolled
        ? headerHeight
        : Math.max(80, headerHeight - 26);

      const yOffset = -effectiveHeader - jumpBarHeight - 16;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSubcategoryClick = (sectionId: string, chunk: string) => {
    setActiveSubcategoryMap((prev) => ({ ...prev, [sectionId]: chunk }));

    if (chunk === "All") {
      scrollToSection(sectionId);
      return;
    }

    const section = menuSectionsData.find((s) => s.id === sectionId);
    if (!section) return;

    const targetCat = section.categories.find((c) => c.chunkGroup === chunk);
    if (targetCat) {
      scrollToCategory(`cat-${targetCat.id}`);
    }
  };

  const handleCravingClick = (
    shortcut: (typeof quickCravingShortcuts)[number],
  ) => {
    if (shortcut.targetType === "section") {
      scrollToSection(shortcut.targetId);
    } else if (shortcut.targetType === "category") {
      scrollToCategory(`cat-${shortcut.targetId}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#ede7dc] text-[#4a2a04] selection:bg-[#4a2a04]/15">
      {/* 1. ALWAYS-VISIBLE TOP STICKY NAVIGATION (Point 5: Navigation Friction Reduction) */}
      <header
        ref={topHeaderRef}
        className={`sticky top-0 z-40 border-b-2 border-[#4a2a04] bg-[#f6f0e5]/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isScrolled ? "shadow-md" : "shadow-[0_4px_20px_rgba(74,42,4,0.08)]"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${
            isScrolled ? "py-1.5" : "py-2.5 sm:py-3"
          }`}
        >
          {/* Top Row: Hamburger + Branding */}
          <div className="flex items-center gap-2.5">
            {/* Three Lines Hamburger Button (Opens Directory Drawer) */}
            <button
              type="button"
              aria-label="Open menu directory"
              aria-expanded={isDrawerOpen}
              onClick={() => setIsDrawerOpen(true)}
              className={`group flex shrink-0 items-center justify-center border-2 border-[#4a2a04] bg-[#ede7dc] text-[#4a2a04] shadow-xs transition-all duration-300 ease-in-out hover:bg-[#4a2a04] hover:text-[#f6f0e5] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#e26a2c] ${
                isScrolled ? "h-8 w-8 rounded-xl" : "h-10 w-10 rounded-2xl"
              }`}
            >
              <span
                className={`flex flex-col transition-all duration-300 ${
                  isScrolled ? "gap-0.75" : "gap-1"
                }`}
              >
                <span
                  className={`block rounded-full bg-current transition-all duration-300 group-hover:bg-[#f6f0e5] ${
                    isScrolled ? "h-0.5 w-3.5" : "h-0.75 w-4.5"
                  }`}
                />
                <span
                  className={`block rounded-full bg-current transition-all duration-300 group-hover:bg-[#f6f0e5] ${
                    isScrolled ? "h-0.5 w-3.5" : "h-0.75 w-4.5"
                  }`}
                />
                <span
                  className={`block rounded-full bg-current transition-all duration-300 group-hover:bg-[#f6f0e5] ${
                    isScrolled ? "h-0.5 w-3.5" : "h-0.75 w-4.5"
                  }`}
                />
              </span>
            </button>

            <div className="flex flex-col justify-center">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isScrolled
                    ? "max-h-0 opacity-0 scale-95"
                    : "max-h-6 opacity-100 mb-0.5"
                }`}
              >
                <span className="inline-block rounded-full bg-[#e4d8c4] px-2 py-px text-[9px] font-bold tracking-[0.25em] text-[#72512b] uppercase">
                  Cafe & Restro
                </span>
              </div>
              <h1
                className={`menu-display leading-tight text-[#4a2a04] transition-all duration-300 ease-in-out ${
                  isScrolled ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
                }`}
              >
                The Fire Point
              </h1>
            </div>
          </div>

          {/* Search Bar Row (Point 8: Make Search a Safety Net) */}
          <div
            className={`relative flex items-center transition-all duration-300 ease-in-out ${
              isScrolled ? "mt-1.5" : "mt-2.5"
            }`}
          >
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 flex items-center text-[#72512b] transition-all duration-300 ${
                isScrolled ? "pl-3" : "pl-3.5"
              }`}
            >
              <svg
                className={`transition-all duration-300 ${
                  isScrolled ? "h-3.5 w-3.5" : "h-4 w-4"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <label htmlFor={searchInputId} className="sr-only">
              Search menu items
            </label>
            <input
              id={searchInputId}
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'Pizza', 'Cold Coffee', 'Chilli Paneer', 'under 150'..."
              className={`w-full border-2 border-[#4a2a04] bg-[#ede7dc] pr-10 font-medium text-[#4a2a04] placeholder-[#8a6b47] shadow-inner transition-all duration-300 ease-in-out focus:bg-[#ede7dc] focus:outline-none focus:ring-2 focus:ring-[#4a2a04] ${
                isScrolled
                  ? "rounded-xl py-1 pl-8.5 text-xs"
                  : "rounded-2xl py-2 pl-9.5 text-sm"
              }`}
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className={`flex items-center justify-center rounded-full bg-[#baa17d]/40 font-bold text-[#4a2a04] transition-all duration-300 hover:bg-[#4a2a04] hover:text-[#f6f0e5] ${
                    isScrolled ? "h-5 w-5 text-[10px]" : "h-6 w-6 text-xs"
                  }`}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Quick Filters Row: Dietary Filter + Primary Category Bar (Point 5) */}
          <div
            ref={sectionNavRef}
            className={`flex items-center gap-2 overflow-x-auto scrollbar-none transition-all duration-300 ease-in-out ${
              isScrolled ? "mt-1.5 pb-0.5" : "mt-2.5 pb-1"
            }`}
          >
            {/* Dietary Tabs */}
            <div className="flex shrink-0 items-center rounded-xl border border-[#baa17d] bg-[#ede7dc] p-0.5 transition-all duration-300">
              <button
                type="button"
                onClick={() => setDietaryFilter("all")}
                className={`rounded-lg font-bold transition-all duration-300 ${
                  isScrolled ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
                } ${
                  dietaryFilter === "all"
                    ? "bg-[#4a2a04] text-[#f6f0e5] shadow-xs"
                    : "text-[#5c3d16] hover:text-[#4a2a04]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter("veg")}
                className={`flex items-center gap-1 rounded-lg font-bold transition-all duration-300 ${
                  isScrolled ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs"
                } ${
                  dietaryFilter === "veg"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-emerald-800 hover:bg-emerald-100/60"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Veg
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter("non-veg")}
                className={`flex items-center gap-1 rounded-lg font-bold transition-all duration-300 ${
                  isScrolled ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs"
                } ${
                  dietaryFilter === "non-veg"
                    ? "bg-red-800 text-white shadow-xs"
                    : "text-red-900 hover:bg-red-100/60"
                }`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                Non-Veg
              </button>
            </div>

            <div
              className={`w-px shrink-0 bg-[#baa17d]/60 transition-all duration-300 ${
                isScrolled ? "h-3.5" : "h-4"
              }`}
            />

            {/* Sticky Category Bar with Active Scrollspy Tracking & Auto-Centering (Point 5) */}
            <nav
              aria-label="Major menu section navigation"
              className="flex shrink-0 items-center gap-1.5"
            >
              {menuSectionsData.map((sec) => {
                const isActive =
                  isInMenuSection && activeSectionId === sec.id && !searchQuery;
                return (
                  <button
                    key={sec.id}
                    data-active={isActive}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex shrink-0 items-center gap-1 rounded-xl border font-bold transition-all duration-300 ${
                      isScrolled
                        ? "px-2 py-0.5 text-[11px]"
                        : "px-2.5 py-1 text-xs"
                    } ${
                      isActive
                        ? "border-[#4a2a04] bg-[#4a2a04] text-[#f6f0e5] shadow-xs"
                        : "border-[#baa17d] bg-[#ede7dc] text-[#4a2a04] hover:bg-[#e4d8c4]"
                    }`}
                  >
                    <span>{sec.icon}</span>
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 2. NAVIGATION DRAWER (Full Directory Tree) */}
      <div
        aria-hidden={!isDrawerOpen}
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-[#4a2a04]/40 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Full menu directory navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[90vw] max-w-md flex-col border-r-2 border-[#4a2a04] bg-[#f6f0e5] shadow-[20px_0_50px_rgba(74,42,4,0.25)] transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b-2 border-[#4a2a04] bg-[#ede7dc] px-5 py-4">
          <div>
            <span className="menu-heading text-[10px] font-semibold tracking-[0.3em] text-[#72512b]">
              Cafe & Restro
            </span>
            <h2 className="menu-display text-2xl text-[#4a2a04]">
              The Fire Point
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close menu navigation"
            onClick={() => setIsDrawerOpen(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-[#4a2a04] bg-[#f6f0e5] text-lg font-bold text-[#4a2a04] transition hover:bg-[#4a2a04] hover:text-[#f6f0e5] active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Drawer Menu Directory (Sections & Chunked Categories) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Quick Jump Featured Highlights */}
          <div className="rounded-2xl border-2 border-[#4a2a04] bg-[#e4d8c4] p-3 space-y-2 shadow-xs">
            <p className="text-[10px] font-extrabold tracking-wider text-[#72512b] uppercase">
              Featured Highlights
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => scrollToSection("our-speciality")}
                className="flex items-center gap-2 rounded-xl border-2 border-[#4a2a04] bg-[#f6f0e5] px-3 py-2 text-xs font-bold text-[#4a2a04] shadow-2xs transition hover:bg-[#4a2a04] hover:text-[#f6f0e5] active:scale-95"
              >
                <span className="text-sm">🔥</span>
                <span className="truncate">Our Speciality</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("most-ordered")}
                className="flex items-center gap-2 rounded-xl border-2 border-[#4a2a04] bg-[#f6f0e5] px-3 py-2 text-xs font-bold text-[#4a2a04] shadow-2xs transition hover:bg-[#4a2a04] hover:text-[#f6f0e5] active:scale-95"
              >
                <span className="text-sm">⭐</span>
                <span className="truncate">Most Ordered</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] font-bold tracking-wider text-[#72512b] uppercase pt-1">
            Menu Directory & Quick Jump
          </p>
          {menuSectionsData.map((sec) => (
            <div
              key={sec.id}
              className="rounded-2xl border-2 border-[#4a2a04] bg-[#ede7dc] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className="flex w-full items-center justify-between bg-[#e4d8c4] px-4 py-2.5 text-left transition hover:bg-[#d8c9b1]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{sec.icon}</span>
                  <div>
                    <h3 className="menu-heading text-sm font-bold text-[#4a2a04]">
                      {sec.label}
                    </h3>
                    <p className="text-[10px] text-[#72512b]">{sec.eyebrow}</p>
                  </div>
                </div>
                <span className="rounded-md bg-[#4a2a04] px-2 py-0.5 text-[10px] font-bold text-[#f6f0e5]">
                  {sec.categories.reduce((acc, c) => acc + c.items.length, 0)}{" "}
                  items
                </span>
              </button>

              <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#f6f0e5]/80">
                {sec.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => scrollToCategory(`cat-${cat.id}`)}
                    className="flex items-center justify-between gap-1.5 rounded-lg border border-[#baa17d]/60 bg-[#ede7dc] px-2 py-1.5 text-left text-xs font-medium text-[#4a2a04] transition hover:border-[#4a2a04] hover:bg-[#e4d8c4] active:scale-98"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-[#4a2a04]/40 bg-[#f6f0e5]">
                        <Image
                          src={
                            categoryImages[cat.imageKey] ||
                            categoryImages.starters
                          }
                          alt=""
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs leading-tight font-semibold text-[#4a2a04] truncate">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#72512b] font-semibold shrink-0">
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 4. MAIN CONTENT CONTAINER */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8 pb-28 sm:pb-36">
        {/* ========================================================================= */}
        {/* DISCOVERY / HERO ZONE (Points 1, 2, 3, 4: Reduce Overload & Social Proof) */}
        {/* Shown when not actively searching to make the first interaction focused!  */}
        {/* ========================================================================= */}
        {!searchQuery && (
          <div className="space-y-6 mb-10">
            {/* POINT 1 & 2: "WHAT ARE YOU CRAVING?" QUICK-INTENT SHORTCUTS */}
            <section
              aria-label="What are you craving?"
              className="rounded-3xl border-2 border-[#4a2a04] bg-[#f6f0e5] p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#72512b]">
                      Fast Starting Points
                    </span>
                    <h2 className="menu-heading text-base font-bold text-[#4a2a04] sm:text-lg">
                      What are you craving?
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection("asian-kitchen")}
                  className="text-xs font-bold text-[#e26a2c] hover:underline"
                >
                  Explore All ↓
                </button>
              </div>

              {/* Quick Intent Shortcut Pills / Cards */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {quickCravingShortcuts.map((craving) => (
                  <button
                    key={craving.id}
                    type="button"
                    onClick={() => handleCravingClick(craving)}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-[#baa17d]/70 bg-[#ede7dc] p-2.5 text-center text-[#4a2a04] transition hover:border-[#4a2a04] hover:bg-[#e4d8c4] active:scale-95"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f6f0e5] shadow-xs mb-1.5 transition-transform group-hover:scale-105">
                      <Image
                        src={
                          categoryImages[craving.imageKey] ||
                          categoryImages.starters
                        }
                        alt={craving.label}
                        fill
                        priority
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold leading-tight">
                      {craving.label}
                    </span>
                    <span className="text-[9px] mt-0.5 leading-tight w-full text-[#72512b]">
                      {craving.description}
                    </span>
                  </button>
                ))}
              </div>

              {/* Popular quick search keyword chips */}
              <div className="mt-3.5 pt-3 border-t border-[#baa17d]/40 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
                <span className="font-bold text-[#72512b] uppercase tracking-wider text-[10px] shrink-0">
                  Quick tags:
                </span>
                {popularQuickSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      searchInputRef.current?.focus();
                    }}
                    className="shrink-0 rounded-full border border-[#baa17d] bg-[#f6f0e5] px-2.5 py-0.75 text-xs font-semibold text-[#5c3d16] transition hover:border-[#4a2a04] hover:bg-[#4a2a04] hover:text-[#f6f0e5]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>

            {/* OUR SPECIALITY SECTION */}
            <section
              id="our-speciality"
              aria-label="Our Speciality"
              className="rounded-3xl border-2 border-[#4a2a04] bg-[#f6f0e5] p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-extrabold tracking-[0.2em] text-[#4a2a04] uppercase border border-orange-500/30">
                      Chef&apos;s Highlights
                    </span>
                  </div>
                  <h2 className="menu-display text-xl text-[#4a2a04] sm:text-2xl mt-0.5 flex items-center gap-2">
                    <span>🔥</span>
                    <span>OUR SPECIALITY</span>
                  </h2>
                </div>
                <p className="text-xs font-medium text-[#5c3d16]">
                  Handcrafted signature creations loved for their unique & rich flavors.
                </p>
              </div>

              {/* 4 Speciality items */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {ourSpecialityItems.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#4a2a04] bg-[#ede7dc] p-2.5 sm:p-3 shadow-xs transition hover:shadow-md hover:border-[#e26a2c]"
                  >
                    <div>
                      {/* Clean Featured Image Container */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#4a2a04]/30 bg-[#f6f0e5] mb-2.5">
                        <Image
                          src={
                            item.image ||
                            categoryImages[item.imageKey] ||
                            categoryImages.starters
                          }
                          alt={item.name}
                          fill
                          priority
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Category Label */}
                      <div className="mb-1">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#72512b]">
                          {item.categoryName}
                        </span>
                      </div>

                      {/* Title beside Veg Badge */}
                      <div className="flex items-center gap-1.5 min-w-0 max-w-full">
                        <VegBadge isVeg={item.isVeg} />
                        <h3
                          className={`font-bold text-[#4a2a04] group-hover:text-[#e26a2c] transition leading-[1.15] wrap-break-word ${
                            item.name.length > 22
                              ? "text-[10px] sm:text-xs"
                              : item.name.length > 16
                                ? "text-[11px] sm:text-xs"
                                : "text-xs sm:text-sm"
                          }`}
                        >
                          {item.name}
                        </h3>
                      </div>
                      {item.badge && (
                        <div className="mt-1">
                          <ItemBadgePill badge={item.badge} />
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between border-t border-[#baa17d]/40 pt-2 gap-1">
                      <span className="rounded-lg bg-[#f6f0e5] px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-extrabold text-[#4a2a04] border border-[#baa17d]/60">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.sectionId)}
                        className="text-[10px] sm:text-[11px] font-bold text-[#72512b] hover:text-[#4a2a04] transition"
                      >
                        View in menu →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* POINT 3: ⭐ MOST ORDERED (Social Proof - 8 Items Maximum) */}
            <section
              id="most-ordered"
              aria-label="Most Ordered Dishes"
              className="rounded-3xl border-2 border-[#4a2a04] bg-[#e4d8c4] p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-extrabold tracking-[0.2em] text-[#4a2a04] uppercase">
                      Customer Favorites
                    </span>
                  </div>
                  <h2 className="menu-display text-xl text-[#4a2a04] sm:text-2xl mt-0.5">
                    MOST ORDERED
                  </h2>
                </div>
                <p className="text-xs font-medium text-[#5c3d16]">
                  Genuine top picks loved by our everyday cafe diners.
                </p>
              </div>

              {/* 5-8 Curated items (Visual Hierarchy Level 1) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {mostOrderedItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#4a2a04] bg-[#f6f0e5] p-2.5 sm:p-3 shadow-xs transition hover:shadow-md hover:border-[#e26a2c]"
                  >
                    <div>
                      {/* Clean Featured Image Container */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[#4a2a04]/30 bg-[#ede7dc] mb-2.5">
                        <Image
                          src={
                            item.image ||
                            categoryImages[item.imageKey] ||
                            categoryImages.starters
                          }
                          alt={item.name}
                          fill
                          priority={index < 4}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Category Label */}
                      <div className="mb-1">
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#72512b]">
                          {item.categoryName}
                        </span>
                      </div>

                      {/* Title beside Veg Badge */}
                      <div className="flex items-center gap-1.5 min-w-0 max-w-full">
                        <VegBadge isVeg={item.isVeg} />
                        <h3
                          className={`font-bold text-[#4a2a04] group-hover:text-[#e26a2c] transition leading-[1.15] wrap-break-word ${
                            item.name.length > 22
                              ? "text-[10px] sm:text-xs"
                              : item.name.length > 16
                                ? "text-[11px] sm:text-xs"
                                : "text-xs sm:text-sm"
                          }`}
                        >
                          {item.name}
                        </h3>
                      </div>
                      {item.badge && (
                        <div className="mt-1">
                          <ItemBadgePill badge={item.badge} />
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-between border-t border-[#baa17d]/40 pt-2 gap-1">
                      <span className="rounded-lg bg-[#ede7dc] px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-extrabold text-[#4a2a04] border border-[#baa17d]/60">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.sectionId)}
                        className="text-[10px] sm:text-[11px] font-bold text-[#72512b] hover:text-[#4a2a04] transition"
                      >
                        View in menu →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Empty State when Search has no matches */}
        {filteredSections.length === 0 && (
          <div className="my-12 rounded-3xl border-2 border-dashed border-[#baa17d] bg-[#f6f0e5] p-8 text-center sm:p-12">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ede7dc] text-3xl">
              🔍
            </div>
            <h2 className="menu-heading text-2xl font-bold text-[#4a2a04]">
              No dishes found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5c3d16]">
              We couldn&apos;t find any items matching &ldquo;{searchQuery}
              &rdquo; with your current filters.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setDietaryFilter("all");
                }}
                className="rounded-xl border-2 border-[#4a2a04] bg-[#4a2a04] px-4 py-2 text-xs font-bold text-[#f6f0e5] transition hover:bg-[#2c1700]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. FULL MENU DISPLAY WITH CHUNKING & 3-TIER VISUAL HIERARCHY (Points 5, 6, 7) */}
        {/* ========================================================================= */}
        <div className="space-y-12">
          {filteredSections.map((section) => {
            return (
              <section
                key={section.id}
                id={section.id}
                style={{ scrollMarginTop: `${headerHeight + 16}px` }}
                className="space-y-4"
              >
                {/* Section Header */}
                <div className="flex flex-col gap-1 border-b-2 border-[#4a2a04] pb-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="menu-heading text-[10px] font-bold tracking-[0.3em] text-[#72512b]">
                      {section.eyebrow}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="menu-display text-2xl text-[#4a2a04] sm:text-3xl">
                        {section.label}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#5c3d16] sm:max-w-md sm:text-right">
                    {section.description}
                  </p>
                </div>

                {/* STICKY JUMP TO BAR FOR THIS CATEGORY SECTION */}
                <JumpToNavBar
                  key={`jump-${section.id}`}
                  section={section}
                  activeSubcategoryMap={activeSubcategoryMap}
                  handleSubcategoryClick={handleSubcategoryClick}
                  headerHeight={headerHeight}
                  searchQuery={searchQuery}
                />

                {/* Categories Grid (Chunked & 3-Tier Visual Hierarchy with Larger Items & Thumbnails) */}
                <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                  {section.categories.map((category) => (
                    <article
                      key={category.id}
                      id={`cat-${category.id}`}
                      style={{
                        scrollMarginTop: `${
                          headerHeight +
                          (!searchQuery &&
                          section.chunks &&
                          section.chunks.length > 1
                            ? 48
                            : 0) +
                          16
                        }px`,
                      }}
                      className="flex flex-col rounded-2xl border-2 border-[#4a2a04] bg-[#f6f0e5] shadow-xs transition hover:shadow-md"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between gap-3 border-b-2 border-[#4a2a04] bg-[#e4d8c4] px-4 py-3 rounded-t-[14px] shadow-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border-2 border-[#4a2a04] bg-[#ede7dc] shadow-sm">
                            <Image
                              src={
                                categoryImages[category.imageKey] ||
                                categoryImages.starters
                              }
                              alt={category.name}
                              fill
                              sizes="48px"
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h3 className="menu-heading text-base sm:text-lg font-bold leading-tight text-[#4a2a04]">
                              {category.name}
                            </h3>
                            <span className="text-xs text-[#72512b] font-medium">
                              {category.items.length}{" "}
                              {category.items.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Item Rows with Thumbnail Images & Uniform Card Styling */}
                      <div className="flex-1 divide-y divide-[#baa17d]/40 p-3 sm:p-4 space-y-2">
                        {category.items.map((item) => {
                          return (
                            <div
                              key={item.name}
                              className="group flex items-center justify-between gap-3 sm:gap-4 py-3 first:pt-1 last:pb-1 rounded-xl transition px-2 hover:bg-[#ede7dc]/60"
                            >
                              {/* Dynamic Item Image Thumbnail */}
                              {item.image && (
                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#4a2a04]/40 bg-[#ede7dc] shadow-xs transition-transform group-hover:scale-105">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 64px, 80px"
                                    className="object-cover"
                                  />
                                </div>
                              )}

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <VegBadge isVeg={item.isVeg} />
                                  <span
                                    className={`font-semibold text-[#4a2a04] leading-[1.15] wrap-break-word ${
                                      item.name.length > 28
                                        ? "text-xs sm:text-sm"
                                        : item.name.length > 18
                                          ? "text-sm sm:text-base"
                                          : "text-base sm:text-lg"
                                    }`}
                                  >
                                    <HighlightText
                                      text={item.name}
                                      highlightWords={
                                        item.matchInfo?.highlightWords || []
                                      }
                                    />
                                  </span>
                                </div>
                                {item.badge && (
                                  <div className="mt-1">
                                    <ItemBadgePill badge={item.badge} />
                                  </div>
                                )}
                              </div>

                              {/* Price aligned to the right */}
                              <div className="shrink-0 text-right pl-1">
                                <span className="inline-block text-sm sm:text-base font-extrabold text-[#4a2a04] bg-[#ede7dc] px-2.5 py-1 rounded-lg border border-[#baa17d]/70 shadow-2xs whitespace-nowrap">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>

                {/* POINT 9: CONTEXTUAL STATIC PAIRING CALLOUTS */}
                {!searchQuery && section.id === "asian-kitchen" && (
                  <div className="mt-6 rounded-3xl border-2 border-dashed border-[#baa17d] bg-[#e4d8c4]/60 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {staticPairings.afterDinner.accentIcon}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#72512b]">
                            {staticPairings.afterDinner.eyebrow}
                          </span>
                          <h4 className="menu-heading text-sm font-bold text-[#4a2a04]">
                            {staticPairings.afterDinner.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs text-[#5c3d16]">
                        {staticPairings.afterDinner.subtitle}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {staticPairings.afterDinner.items.map((pItem) => (
                        <div
                          key={pItem.name}
                          className="flex items-center justify-between rounded-xl border border-[#baa17d] bg-[#f6f0e5] p-2.5"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#4a2a04]">
                              {pItem.name}
                            </p>
                            <p className="text-[10px] text-[#72512b]">
                              {pItem.tagline}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-extrabold text-[#4a2a04] ml-2">
                            {formatPrice(pItem.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery && section.id === "cafe-bites" && (
                  <div className="mt-6 rounded-3xl border-2 border-dashed border-[#baa17d] bg-[#e4d8c4]/60 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {staticPairings.afterPizza.accentIcon}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#72512b]">
                            {staticPairings.afterPizza.eyebrow}
                          </span>
                          <h4 className="menu-heading text-sm font-bold text-[#4a2a04]">
                            {staticPairings.afterPizza.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs text-[#5c3d16]">
                        {staticPairings.afterPizza.subtitle}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {staticPairings.afterPizza.items.map((pItem) => (
                        <div
                          key={pItem.name}
                          className="flex items-center justify-between rounded-xl border border-[#baa17d] bg-[#f6f0e5] p-2.5"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#4a2a04]">
                              {pItem.name}
                            </p>
                            <p className="text-[10px] text-[#72512b]">
                              {pItem.tagline}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-extrabold text-[#4a2a04] ml-2">
                            {formatPrice(pItem.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!searchQuery && section.id === "drinks-desserts" && (
                  <div className="mt-6 rounded-3xl border-2 border-dashed border-[#baa17d] bg-[#e4d8c4]/60 p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {staticPairings.afterCoffee.accentIcon}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#72512b]">
                            {staticPairings.afterCoffee.eyebrow}
                          </span>
                          <h4 className="menu-heading text-sm font-bold text-[#4a2a04]">
                            {staticPairings.afterCoffee.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs text-[#5c3d16]">
                        {staticPairings.afterCoffee.subtitle}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {staticPairings.afterCoffee.items.map((pItem) => (
                        <div
                          key={pItem.name}
                          className="flex items-center justify-between rounded-xl border border-[#baa17d] bg-[#f6f0e5] p-2.5"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#4a2a04]">
                              {pItem.name}
                            </p>
                            <p className="text-[10px] text-[#72512b]">
                              {pItem.tagline}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-extrabold text-[#4a2a04] ml-2">
                            {formatPrice(pItem.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ACTIONABLE FOOTER: REVIEW US ONLY */}
        {/* ========================================================================= */}
        <footer className="mt-16 rounded-3xl border-2 border-[#4a2a04] bg-[#e4d8c4] p-6 text-center text-[#4a2a04] sm:p-10 space-y-5 shadow-sm">
          <div className="space-y-2">
            <span className="menu-heading text-[10px] font-bold tracking-[0.3em] text-[#72512b] uppercase">
              The Fire Point • Cafe & Restro
            </span>
            <h2 className="menu-display text-3xl sm:text-4xl text-[#4a2a04]">
              Enjoyed your visit?
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-[#5c3d16] leading-relaxed">
              Every dish is freshly prepared to order with love. Your review
              helps us grow and keep serving you the best food experience!
            </p>
          </div>

          {/* 5 Gold Stars Rating Display */}
          <div
            className="flex items-center justify-center gap-1.5 text-amber-500 text-2xl"
            aria-label="5 stars rating"
          >
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          {/* Prominent Review Us CTA Button */}
          <div className="mx-auto max-w-sm pt-1">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-[#4a2a04] bg-[#4a2a04] px-6 py-4 text-[#f6f0e5] shadow-md transition-all duration-300 hover:bg-[#2c1700] hover:shadow-lg active:scale-98"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f6f0e5] text-base font-black text-[#4a2a04] transition group-hover:scale-110">
                G
              </span>
              <div className="text-left">
                <span className="block text-sm sm:text-base font-bold leading-tight">
                  Review Us on Google
                </span>
                <span className="block text-[10px] sm:text-xs text-[#ede7dc] font-medium">
                  Share your experience with us
                </span>
              </div>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <p className="text-[11px] font-semibold text-[#72512b] pt-1">
            Takes less than 1 minute • Thank you for your support! ❤️
          </p>
        </footer>
      </div>

      {/* 6. FLOATING QUICK ACTION BAR (For Seamless Mobile Experience) */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#4a2a04] bg-[#ede7dc] text-[#4a2a04] shadow-lg transition hover:bg-[#4a2a04] hover:text-[#f6f0e5] active:scale-95"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full border-2 border-[#4a2a04] bg-[#4a2a04] px-4 py-2.5 text-xs font-bold text-[#f6f0e5] shadow-lg transition hover:bg-[#2c1700] hover:scale-105 active:scale-95"
        >
          <span className="flex flex-col gap-0.75">
            <span className="block h-0.5 w-3.5 bg-current rounded-full" />
            <span className="block h-0.5 w-3.5 bg-current rounded-full" />
            <span className="block h-0.5 w-3.5 bg-current rounded-full" />
          </span>
          <span>Browse Menu</span>
        </button>
      </div>
    </main>
  );
}
