"use client";

import {
  Bookmark,
  Camera,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Heart,
  ImagePlus,
  Info,
  Menu,
  MessageCircle,
  MoreHorizontal,
  RefreshCcw,
  RotateCcw,
  ScanFace,
  Search,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  creatorById,
  creators,
  lookById,
  looks,
  productById,
  products,
  type Creator,
  type Look,
  type Product,
  type ProductCategory,
} from "@/data/catalog";

type View = "camera" | "discover" | "saved";
type TryMode = "makeup" | "skincare" | "looks";
type SavedState = {
  looks: string[];
  products: string[];
  recent: string[];
};

const DEFAULT_SAVED: SavedState = {
  looks: ["silver-lining", "bare-focus"],
  products: ["lip-ember", "skin-barrier"],
  recent: ["soft-signal", "electric-hour"],
};

const onboarding = [
  {
    eyebrow: "Your face, your edit",
    title: "Try beauty in the moment.",
    copy: "Explore colour and curated looks on your own photo — private by default.",
    image: "/images/look-afro.jpg",
    accent: "#ff6c75",
  },
  {
    eyebrow: "Creator made",
    title: "Find a look. Make it yours.",
    copy: "Discover artist-built edits, see every product, then remix the mood.",
    image: "/images/look-neon.jpg",
    accent: "#a89cff",
  },
  {
    eyebrow: "A softer forecast",
    title: "Preview a skincare journey.",
    copy: "Explore subtle, clearly labeled visual simulations over time — never promises.",
    image: "/images/look-freckled.jpg",
    accent: "#ffca71",
  },
];

const makeupCategories: Array<{
  id: ProductCategory | "full";
  label: string;
}> = [
  { id: "full", label: "Full looks" },
  { id: "lips", label: "Lips" },
  { id: "blush", label: "Blush" },
  { id: "eyes", label: "Eyes" },
  { id: "complexion", label: "Skin" },
];

const skinGoals = [
  { id: "skin-barrier", label: "Comfort + barrier" },
  { id: "skin-radiance", label: "Visible radiance" },
  { id: "skin-calm", label: "Calm hydration" },
  { id: "skin-night", label: "Smooth texture" },
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function useSavedState() {
  const [saved, setSaved] = useState<SavedState>(DEFAULT_SAVED);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem("glowdesk-saved");
      if (!stored) return;
      try {
        setSaved(JSON.parse(stored) as SavedState);
      } catch {
        window.localStorage.removeItem("glowdesk-saved");
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const update = (next: SavedState) => {
    setSaved(next);
    window.localStorage.setItem("glowdesk-saved", JSON.stringify(next));
  };

  const toggleLook = (id: string) => {
    update({
      ...saved,
      looks: saved.looks.includes(id)
        ? saved.looks.filter((lookId) => lookId !== id)
        : [id, ...saved.looks],
    });
  };

  const toggleProduct = (id: string) => {
    update({
      ...saved,
      products: saved.products.includes(id)
        ? saved.products.filter((productId) => productId !== id)
        : [id, ...saved.products],
    });
  };

  const addRecent = (id: string) => {
    update({
      ...saved,
      recent: [id, ...saved.recent.filter((lookId) => lookId !== id)].slice(
        0,
        6,
      ),
    });
  };

  return { saved, toggleLook, toggleProduct, addRecent };
}

export default function GlowdeskApp() {
  const [view, setView] = useState<View>("camera");
  const [mode, setMode] = useState<TryMode>("makeup");
  const [onboardingStep, setOnboardingStep] = useState<number | null>(0);
  const [activeLookId, setActiveLookId] = useState("soft-signal");
  const [activeProductId, setActiveProductId] = useState("lip-ember");
  const [productSheet, setProductSheet] = useState<Product | null>(null);
  const [creatorSheet, setCreatorSheet] = useState<Creator | null>(null);
  const [toast, setToast] = useState("");
  const { saved, toggleLook, toggleProduct, addRecent } = useSavedState();

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const hasSeenOnboarding = window.localStorage.getItem(
        "glowdesk-onboarding",
      );
      if (hasSeenOnboarding) setOnboardingStep(null);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const closeOnboarding = () => {
    window.localStorage.setItem("glowdesk-onboarding", "seen");
    setOnboardingStep(null);
  };

  const tryLook = (lookId: string) => {
    const look = lookById(lookId);
    if (!look) return;
    setActiveLookId(lookId);
    setActiveProductId(look.productIds[0]);
    setMode("looks");
    setView("camera");
    addRecent(lookId);
    setToast(`${look.title} is ready to try`);
  };

  const share = async (label: string) => {
    const shareData = {
      title: "Glowdesk",
      text: `See ${label} on Glowdesk`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setToast("Share link copied");
      }
    } catch {
      setToast("Sharing cancelled");
    }
  };

  return (
    <div className="app-shell">
      <aside className="desktop-rail" aria-label="Primary navigation">
        <button
          className="wordmark"
          onClick={() => setView("camera")}
          aria-label="Glowdesk home"
        >
          glow<span>desk</span>
        </button>
        <nav className="rail-nav">
          <NavButton
            active={view === "camera"}
            icon={<ScanFace />}
            label="Try on"
            onClick={() => setView("camera")}
          />
          <NavButton
            active={view === "discover"}
            icon={<Sparkles />}
            label="Discover"
            onClick={() => setView("discover")}
          />
          <NavButton
            active={view === "saved"}
            icon={<Bookmark />}
            label="Saved"
            onClick={() => setView("saved")}
          />
        </nav>
        <button
          className="rail-profile"
          onClick={() => setToast("Your profile is ready for a future account")}
          aria-label="Open profile"
        >
          <CircleUserRound />
        </button>
      </aside>

      <header className="mobile-header">
        <button
          className="wordmark"
          onClick={() => setView("camera")}
          aria-label="Glowdesk home"
        >
          glow<span>desk</span>
        </button>
        <button
          className="icon-button quiet"
          aria-label="Open menu"
          onClick={() => setToast("Everything you need is in the bottom bar")}
        >
          <Menu />
        </button>
      </header>

      <main className="app-main">
        {view === "camera" && (
          <CameraExperience
            mode={mode}
            setMode={setMode}
            activeLookId={activeLookId}
            setActiveLookId={setActiveLookId}
            activeProductId={activeProductId}
            setActiveProductId={setActiveProductId}
            saved={saved}
            toggleLook={toggleLook}
            toggleProduct={toggleProduct}
            openProduct={setProductSheet}
            openCreator={setCreatorSheet}
            addRecent={addRecent}
            notify={setToast}
            share={share}
          />
        )}
        {view === "discover" && (
          <DiscoverFeed
            saved={saved}
            toggleLook={toggleLook}
            openProduct={setProductSheet}
            openCreator={setCreatorSheet}
            tryLook={tryLook}
            share={share}
            notify={setToast}
          />
        )}
        {view === "saved" && (
          <SavedLibrary
            saved={saved}
            tryLook={tryLook}
            openProduct={setProductSheet}
            toggleLook={toggleLook}
            toggleProduct={toggleProduct}
          />
        )}
      </main>

      <nav className="mobile-nav" aria-label="Primary navigation">
        <NavButton
          active={view === "camera"}
          icon={<ScanFace />}
          label="Try on"
          onClick={() => setView("camera")}
        />
        <NavButton
          active={view === "discover"}
          icon={<Sparkles />}
          label="Discover"
          onClick={() => setView("discover")}
        />
        <button
          className="nav-camera"
          aria-label="Open camera try-on"
          onClick={() => setView("camera")}
        >
          <Camera />
        </button>
        <NavButton
          active={view === "saved"}
          icon={<Bookmark />}
          label="Saved"
          onClick={() => setView("saved")}
        />
        <NavButton
          icon={<UserRound />}
          label="You"
          onClick={() => setToast("Profiles are coming next")}
        />
      </nav>

      {onboardingStep !== null && (
        <Onboarding
          step={onboardingStep}
          onNext={() => {
            if (onboardingStep === onboarding.length - 1) closeOnboarding();
            else setOnboardingStep(onboardingStep + 1);
          }}
          onSkip={closeOnboarding}
        />
      )}

      {productSheet && (
        <ProductSheet
          product={productSheet}
          saved={saved.products.includes(productSheet.id)}
          onClose={() => setProductSheet(null)}
          onSave={() => {
            toggleProduct(productSheet.id);
            setToast(
              saved.products.includes(productSheet.id)
                ? "Removed from saved"
                : "Product saved",
            );
          }}
          onTry={() => {
            setActiveProductId(productSheet.id);
            setMode(
              productSheet.category === "skincare" ? "skincare" : "makeup",
            );
            setView("camera");
            setProductSheet(null);
            setToast(`${productSheet.name} is active`);
          }}
          onShop={() =>
            setToast("Affiliate shop handoff previewed — no purchase made")
          }
          onSelectShade={(product) => {
            setProductSheet(product);
            setToast(`${product.shade} selected`);
          }}
          openCreator={(creator) => {
            setProductSheet(null);
            setCreatorSheet(creator);
          }}
        />
      )}

      {creatorSheet && (
        <CreatorSheet
          creator={creatorSheet}
          onClose={() => setCreatorSheet(null)}
          tryLook={(id) => {
            setCreatorSheet(null);
            tryLook(id);
          }}
          notify={setToast}
        />
      )}

      <div
        className={cx("toast", toast && "toast-visible")}
        role="status"
        aria-live="polite"
      >
        <Sparkles />
        {toast}
      </div>
    </div>
  );
}

function NavButton({
  active = false,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cx("nav-button", active && "nav-button-active")}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function CameraExperience({
  mode,
  setMode,
  activeLookId,
  setActiveLookId,
  activeProductId,
  setActiveProductId,
  saved,
  toggleLook,
  toggleProduct,
  openProduct,
  openCreator,
  addRecent,
  notify,
  share,
}: {
  mode: TryMode;
  setMode: (mode: TryMode) => void;
  activeLookId: string;
  setActiveLookId: (id: string) => void;
  activeProductId: string;
  setActiveProductId: (id: string) => void;
  saved: SavedState;
  toggleLook: (id: string) => void;
  toggleProduct: (id: string) => void;
  openProduct: (product: Product) => void;
  openCreator: (creator: Creator) => void;
  addRecent: (id: string) => void;
  notify: (message: string) => void;
  share: (label: string) => Promise<void>;
}) {
  const [category, setCategory] = useState<ProductCategory | "full">("full");
  const [intensity, setIntensity] = useState(64);
  const [compare, setCompare] = useState(false);
  const [comparePosition, setComparePosition] = useState(52);
  const [skinWeek, setSkinWeek] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeLook = lookById(activeLookId) ?? looks[0];
  const activeProduct = productById(activeProductId) ?? products[0];
  const activeCreator = creatorById(activeLook.creatorId) ?? creators[0];
  const image = uploadedImage ?? "/images/look-freckled.jpg";

  const categoryProducts = useMemo(() => {
    if (category === "full") {
      return activeLook.productIds
        .map(productById)
        .filter((product): product is Product => Boolean(product));
    }
    return products.filter((product) => product.category === category);
  }, [activeLook.productIds, category]);

  const runAnalysis = (callback: () => void) => {
    setAnalyzing(true);
    window.setTimeout(() => {
      callback();
      setAnalyzing(false);
      notify("Preview mapped to your image");
    }, 1100);
  };

  const selectMode = (nextMode: TryMode) => {
    if (nextMode === mode) return;
    runAnalysis(() => setMode(nextMode));
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    stopCamera();
    setCameraError("");
    setUploadedImage(URL.createObjectURL(file));
    runAnalysis(() => undefined);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Live camera is not supported here. Upload a selfie instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setUploadedImage(null);
      setCameraError("");
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
      runAnalysis(() => undefined);
    } catch {
      setCameraError("Camera permission was not granted. Your demo image is still ready.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const reset = () => {
    stopCamera();
    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(null);
    setCompare(false);
    setIntensity(64);
    setActiveLookId("soft-signal");
    setActiveProductId("lip-ember");
    notify("Preview reset");
  };

  const chooseLook = (look: Look) => {
    runAnalysis(() => {
      setActiveLookId(look.id);
      setActiveProductId(look.productIds[0]);
      addRecent(look.id);
    });
  };

  const currentTint =
    mode === "skincare" ? "#efbba3" : activeProduct.shadeColor;
  const effectOpacity =
    mode === "skincare"
      ? skinWeek * 0.012
      : Math.max(0.12, intensity / 125);
  const stageStyle = {
    "--effect-tint": currentTint,
    "--effect-opacity": effectOpacity,
    "--compare-position": `${comparePosition}%`,
    "--skin-brightness": 1 + skinWeek * 0.004,
    "--skin-saturation": 1 - skinWeek * 0.0015,
  } as CSSProperties;

  return (
    <section className="studio-layout">
      <div className="studio-copy">
        <p className="eyebrow">Private try-on studio</p>
        <h1>Make the mirror<br />more interesting.</h1>
        <p>
          Explore a look on your own face, then follow the products and artists
          behind it.
        </p>
        <div className="desktop-studio-meta">
          <span><ScanFace /> Processed on this device</span>
          <span><WandSparkles /> Visual preview, not an exact result</span>
        </div>
      </div>

      <div className="camera-phone">
        <div className="camera-stage" style={stageStyle}>
          {cameraActive ? (
            <video
              ref={videoRef}
              className="camera-media camera-video"
              playsInline
              muted
              aria-label="Live front camera preview"
            />
          ) : (
            <Image
              src={image}
              alt={
                uploadedImage
                  ? "Your locally uploaded selfie"
                  : "Model demonstrating Glowdesk virtual try-on"
              }
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="camera-media"
            />
          )}

          <div
            className={cx(
              "beauty-effect",
              `effect-${mode}`,
              compare && "beauty-effect-compare",
            )}
            aria-hidden="true"
          />

          {compare && (
            <div
              className="compare-line"
              style={{ left: `${comparePosition}%` }}
              aria-hidden="true"
            >
              <span>Before</span>
              <i />
              <span>After</span>
            </div>
          )}

          <div className="camera-vignette" aria-hidden="true" />

          <header className="camera-topbar">
            <span className="live-pill">
              <i />
              {cameraActive ? "Live" : uploadedImage ? "Your photo" : "Demo model"}
            </span>
            <div>
              <button
                className="icon-button glass"
                aria-label="Reset preview"
                onClick={reset}
              >
                <RotateCcw />
              </button>
              <button
                className="icon-button glass"
                aria-label="More camera options"
                onClick={() => notify("Auto-light and face guide are on")}
              >
                <MoreHorizontal />
              </button>
            </div>
          </header>

          <div className="camera-side-actions">
            <ActionButton
              icon={<RefreshCcw />}
              label={compare ? "After" : "Compare"}
              active={compare}
              onClick={() => setCompare((value) => !value)}
            />
            <ActionButton
              icon={<Heart />}
              label="Save"
              active={saved.looks.includes(activeLook.id)}
              onClick={() => {
                toggleLook(activeLook.id);
                notify(
                  saved.looks.includes(activeLook.id)
                    ? "Look removed"
                    : "Look saved",
                );
              }}
            />
            <ActionButton
              icon={<Share2 />}
              label="Share"
              onClick={() => void share(activeLook.title)}
            />
          </div>

          <div className="mode-switch" role="tablist" aria-label="Try-on mode">
            {(["makeup", "skincare", "looks"] as TryMode[]).map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={mode === item}
                className={mode === item ? "active" : undefined}
                onClick={() => selectMode(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="camera-lower">
            {mode === "makeup" && (
              <MakeupControls
                category={category}
                setCategory={setCategory}
                products={categoryProducts}
                activeProduct={activeProduct}
                onProduct={(product) => {
                  setActiveProductId(product.id);
                  notify(`${product.shade} selected`);
                }}
                intensity={intensity}
                setIntensity={setIntensity}
              />
            )}

            {mode === "looks" && (
              <LookControls
                activeLook={activeLook}
                onLook={chooseLook}
                openCreator={() => openCreator(activeCreator)}
              />
            )}

            {mode === "skincare" && (
              <SkincareControls
                activeProduct={activeProduct}
                onProduct={(product) => {
                  setActiveProductId(product.id);
                  setSkinWeek(0);
                  runAnalysis(() => undefined);
                }}
                week={skinWeek}
                setWeek={setSkinWeek}
              />
            )}

            {compare && (
              <label className="compare-control">
                <span className="sr-only">Before and after comparison position</span>
                <input
                  type="range"
                  min="8"
                  max="92"
                  value={comparePosition}
                  onChange={(event) =>
                    setComparePosition(Number(event.target.value))
                  }
                />
              </label>
            )}

            <div className="capture-row">
              <button
                className="mini-capture-action"
                aria-label="Upload a selfie"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus />
                <span>Upload</span>
              </button>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleUpload}
              />
              <button
                className={cx("capture-button", capturing && "capturing")}
                aria-label="Capture preview"
                onClick={() => {
                  setCapturing(true);
                  addRecent(activeLook.id);
                  window.setTimeout(() => setCapturing(false), 500);
                  notify("Preview captured to recent tries");
                }}
              >
                <span />
              </button>
              <button
                className="mini-capture-action"
                aria-label={cameraActive ? "Stop camera" : "Open live camera"}
                onClick={cameraActive ? stopCamera : startCamera}
              >
                {cameraActive ? <X /> : <Camera />}
                <span>{cameraActive ? "Close" : "Live"}</span>
              </button>
            </div>

            <button className="active-tray" onClick={() => setSheetOpen(true)}>
              <span
                className="tray-swatch"
                style={{ background: currentTint }}
              />
              <span>
                <small>{mode === "skincare" ? "Journey" : "Now trying"}</small>
                <strong>
                  {mode === "looks" ? activeLook.title : activeProduct.name}
                </strong>
              </span>
              <ChevronUp />
            </button>
          </div>

          {analyzing && (
            <div className="analysis-state" role="status">
              <div className="face-map" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <strong>Mapping your preview</strong>
              <span>Keeping skin texture beautifully real</span>
            </div>
          )}
        </div>

        {cameraError && (
          <p className="camera-message">
            <Info />
            {cameraError}
          </p>
        )}
      </div>

      <aside className="studio-detail">
        <div className="detail-header">
          <span className="eyebrow">Current edit</span>
          <button
            className="icon-button quiet"
            aria-label="Save current product"
            onClick={() => toggleProduct(activeProduct.id)}
          >
            <Bookmark
              className={
                saved.products.includes(activeProduct.id) ? "filled-icon" : ""
              }
            />
          </button>
        </div>
        <h2>{mode === "looks" ? activeLook.title : activeProduct.name}</h2>
        <p>
          {mode === "looks" ? activeLook.caption : activeProduct.description}
        </p>
        {mode !== "skincare" && (
          <button
            className="creator-inline"
            onClick={() => openCreator(activeCreator)}
          >
            <Image
              src={activeCreator.image}
              alt=""
              width={42}
              height={42}
            />
            <span>
              <small>Edited by</small>
              <strong>{activeCreator.name}</strong>
            </span>
            <ChevronRight />
          </button>
        )}
        <div className="detail-products">
          {(mode === "looks"
            ? activeLook.productIds.map(productById)
            : [activeProduct]
          )
            .filter((product): product is Product => Boolean(product))
            .map((product) => (
              <CompactProduct
                key={product.id}
                product={product}
                onClick={() => openProduct(product)}
              />
            ))}
        </div>
        <button className="primary-button" onClick={() => setSheetOpen(true)}>
          <ShoppingBag />
          View the full edit
        </button>
        <p className="affiliate-note">
          Some future shop links may earn the creator a commission. Your price
          stays the same.
        </p>
      </aside>

      {sheetOpen && (
        <BottomSheet title={mode === "skincare" ? "Your journey" : "The edit"} onClose={() => setSheetOpen(false)}>
          <div className="sheet-look-summary">
            <div
              className="sheet-art"
              style={{
                background: `linear-gradient(145deg, ${currentTint}, #241b24 74%)`,
              }}
            >
              <Sparkles />
            </div>
            <div>
              <p className="eyebrow">
                {mode === "skincare" ? "Visual simulation" : activeLook.mood}
              </p>
              <h3>
                {mode === "skincare" ? activeProduct.name : activeLook.title}
              </h3>
              <p>
                {mode === "skincare"
                  ? "A subtle appearance preview based on your selected goal."
                  : activeLook.caption}
              </p>
            </div>
          </div>
          <div className="sheet-product-list">
            {(mode === "skincare"
              ? [activeProduct]
              : activeLook.productIds.map(productById)
            )
              .filter((product): product is Product => Boolean(product))
              .map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  saved={saved.products.includes(product.id)}
                  onOpen={() => openProduct(product)}
                  onSave={() => toggleProduct(product.id)}
                />
              ))}
          </div>
        </BottomSheet>
      )}
    </section>
  );
}

function MakeupControls({
  category,
  setCategory,
  products: visibleProducts,
  activeProduct,
  onProduct,
  intensity,
  setIntensity,
}: {
  category: ProductCategory | "full";
  setCategory: (category: ProductCategory | "full") => void;
  products: Product[];
  activeProduct: Product;
  onProduct: (product: Product) => void;
  intensity: number;
  setIntensity: (value: number) => void;
}) {
  return (
    <div className="try-controls">
      <div className="category-tabs">
        {makeupCategories.map((item) => (
          <button
            key={item.id}
            className={category === item.id ? "active" : undefined}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="shade-strip">
        {visibleProducts.map((product) => (
          <button
            key={product.id}
            className={cx(
              "shade-chip",
              activeProduct.id === product.id && "active",
            )}
            onClick={() => onProduct(product)}
            aria-label={`${product.name}, ${product.shade}`}
          >
            <span style={{ background: product.shadeColor }} />
            <small>{product.shade.split(" ")[0]}</small>
          </button>
        ))}
      </div>
      <label className="intensity-control">
        <SlidersHorizontal />
        <span>Intensity</span>
        <input
          type="range"
          min="15"
          max="100"
          value={intensity}
          onChange={(event) => setIntensity(Number(event.target.value))}
        />
        <output>{intensity}%</output>
      </label>
    </div>
  );
}

function LookControls({
  activeLook,
  onLook,
  openCreator,
}: {
  activeLook: Look;
  onLook: (look: Look) => void;
  openCreator: () => void;
}) {
  return (
    <div className="try-controls look-controls">
      <button className="look-caption" onClick={openCreator}>
        <span className="eyebrow">{activeLook.mood} edit</span>
        <strong>{activeLook.title}</strong>
        <span>by {creatorById(activeLook.creatorId)?.name}</span>
      </button>
      <div className="look-strip">
        {looks.map((look) => (
          <button
            key={look.id}
            className={cx("look-chip", activeLook.id === look.id && "active")}
            onClick={() => onLook(look)}
            aria-label={`Try ${look.title}`}
          >
            <Image src={look.image} alt="" fill sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SkincareControls({
  activeProduct,
  onProduct,
  week,
  setWeek,
}: {
  activeProduct: Product;
  onProduct: (product: Product) => void;
  week: number;
  setWeek: (week: number) => void;
}) {
  const steps = [0, 2, 4, 8];
  return (
    <div className="try-controls skincare-controls">
      <div className="simulation-label">
        <Info />
        <span>Visual simulation only. Results vary.</span>
      </div>
      <div className="goal-strip">
        {skinGoals.map((goal) => {
          const product = productById(goal.id);
          if (!product) return null;
          return (
            <button
              key={goal.id}
              className={activeProduct.id === goal.id ? "active" : undefined}
              onClick={() => onProduct(product)}
            >
              {goal.label}
            </button>
          );
        })}
      </div>
      <div className="timeline">
        <div className="timeline-track" />
        {steps.map((step) => (
          <button
            key={step}
            className={week === step ? "active" : undefined}
            onClick={() => setWeek(step)}
          >
            <i />
            <span>{step === 0 ? "Today" : `${step} weeks`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx("camera-action", active && "active")}
      onClick={onClick}
    >
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  );
}

function DiscoverFeed({
  saved,
  toggleLook,
  openProduct,
  openCreator,
  tryLook,
  share,
  notify,
}: {
  saved: SavedState;
  toggleLook: (id: string) => void;
  openProduct: (product: Product) => void;
  openCreator: (creator: Creator) => void;
  tryLook: (id: string) => void;
  share: (label: string) => Promise<void>;
  notify: (message: string) => void;
}) {
  const [mood, setMood] = useState("For you");
  const moods = ["For you", "Natural", "Editorial", "Bridal", "Bold"];
  const visible =
    mood === "For you" ? looks : looks.filter((look) => look.mood === mood);

  return (
    <section className="discover-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Made by artists</p>
          <h1>Looks worth<br />stealing.</h1>
        </div>
        <button
          className="icon-button outlined"
          aria-label="Search looks"
          onClick={() => notify("Search is ready for a future catalog")}
        >
          <Search />
        </button>
      </header>
      <div className="mood-filter" aria-label="Filter looks by mood">
        {moods.map((item) => (
          <button
            key={item}
            className={mood === item ? "active" : undefined}
            onClick={() => setMood(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="look-feed">
        {visible.map((look, index) => {
          const creator = creatorById(look.creatorId) ?? creators[0];
          const usedProducts = look.productIds
            .map(productById)
            .filter((product): product is Product => Boolean(product));
          return (
            <article
              className={cx("feed-card", index % 3 === 1 && "feed-card-wide")}
              key={look.id}
            >
              <Image
                src={look.image}
                alt={`${look.title}, a ${look.mood.toLowerCase()} beauty look`}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <div className="feed-shade" />
              <button
                className="feed-creator"
                onClick={() => openCreator(creator)}
              >
                <Image src={creator.image} alt="" width={38} height={38} />
                <span>
                  <strong>{creator.name}</strong>
                  <small>{creator.specialty}</small>
                </span>
              </button>
              <div className="feed-actions">
                <ActionButton
                  icon={<Heart />}
                  label={look.savedCount}
                  active={saved.looks.includes(look.id)}
                  onClick={() => toggleLook(look.id)}
                />
                <ActionButton
                  icon={<Share2 />}
                  label="Share"
                  onClick={() => void share(look.title)}
                />
                <ActionButton
                  icon={<MessageCircle />}
                  label="Ask"
                  onClick={() => notify("Creator Q&A is coming soon")}
                />
              </div>
              <div className="feed-content">
                <p className="eyebrow">{look.mood} / editor&apos;s pick</p>
                <h2>{look.title}</h2>
                <p>{look.caption}</p>
                <div className="product-stack">
                  <div>
                    {usedProducts.map((product) => (
                      <button
                        key={product.id}
                        style={{ background: product.shadeColor }}
                        aria-label={`View ${product.name}`}
                        onClick={() => openProduct(product)}
                      />
                    ))}
                  </div>
                  <span>{usedProducts.length} products in this look</span>
                </div>
                <div className="feed-ctas">
                  <button
                    className="primary-button light"
                    onClick={() => tryLook(look.id)}
                  >
                    <WandSparkles />
                    Try this look
                  </button>
                  <button
                    className="icon-button glass"
                    aria-label={`Shop products in ${look.title}`}
                    onClick={() => openProduct(usedProducts[0])}
                  >
                    <ShoppingBag />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SavedLibrary({
  saved,
  tryLook,
  openProduct,
  toggleLook,
  toggleProduct,
}: {
  saved: SavedState;
  tryLook: (id: string) => void;
  openProduct: (product: Product) => void;
  toggleLook: (id: string) => void;
  toggleProduct: (id: string) => void;
}) {
  const [tab, setTab] = useState<"looks" | "products" | "recent">("looks");
  const savedLooks = saved.looks
    .map(lookById)
    .filter((look): look is Look => Boolean(look));
  const recentLooks = saved.recent
    .map(lookById)
    .filter((look): look is Look => Boolean(look));
  const savedProducts = saved.products
    .map(productById)
    .filter((product): product is Product => Boolean(product));

  return (
    <section className="saved-page">
      <header className="page-heading saved-heading">
        <div>
          <p className="eyebrow">Your beauty drawer</p>
          <h1>Keep the<br />good ones.</h1>
        </div>
        <div className="saved-count">
          <strong>{saved.looks.length + saved.products.length}</strong>
          <span>saved</span>
        </div>
      </header>
      <div className="saved-tabs" role="tablist" aria-label="Saved content">
        {(["looks", "products", "recent"] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : undefined}
            onClick={() => setTab(item)}
          >
            {item === "recent" ? "Recently tried" : item}
          </button>
        ))}
      </div>

      {tab === "looks" && (
        <div className="saved-look-grid">
          {savedLooks.map((look) => (
            <SavedLookCard
              key={look.id}
              look={look}
              onTry={() => tryLook(look.id)}
              onRemove={() => toggleLook(look.id)}
            />
          ))}
        </div>
      )}
      {tab === "products" && (
        <div className="saved-product-list">
          {savedProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              saved
              onOpen={() => openProduct(product)}
              onSave={() => toggleProduct(product.id)}
            />
          ))}
        </div>
      )}
      {tab === "recent" && (
        <div className="recent-row">
          {recentLooks.map((look) => (
            <SavedLookCard
              key={look.id}
              look={look}
              onTry={() => tryLook(look.id)}
            />
          ))}
        </div>
      )}

      {((tab === "looks" && !savedLooks.length) ||
        (tab === "products" && !savedProducts.length) ||
        (tab === "recent" && !recentLooks.length)) && (
        <div className="empty-state">
          <Sparkles />
          <h2>Room for a new favourite.</h2>
          <p>Save a look or product and it will stay waiting here.</p>
        </div>
      )}
    </section>
  );
}

function SavedLookCard({
  look,
  onTry,
  onRemove,
}: {
  look: Look;
  onTry: () => void;
  onRemove?: () => void;
}) {
  const creator = creatorById(look.creatorId);
  return (
    <article className="saved-look-card">
      <div className="saved-look-image">
        <Image
          src={look.image}
          alt={`${look.title} by ${creator?.name}`}
          fill
          sizes="(max-width: 767px) 50vw, 280px"
        />
        {onRemove && (
          <button
            className="icon-button glass"
            aria-label={`Remove ${look.title} from saved`}
            onClick={onRemove}
          >
            <Bookmark className="filled-icon" />
          </button>
        )}
      </div>
      <p className="eyebrow">{look.mood}</p>
      <h2>{look.title}</h2>
      <span>by {creator?.name}</span>
      <button className="text-button" onClick={onTry}>
        Try look <ArrowRight />
      </button>
    </article>
  );
}

function CompactProduct({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  return (
    <button className="compact-product" onClick={onClick}>
      <span
        className="compact-product-art"
        style={{
          background: `radial-gradient(circle at 38% 28%, #fff8, transparent 22%), ${product.shadeColor}`,
        }}
      >
        <i />
      </span>
      <span>
        <small>
          {product.brand} / {product.shade}
        </small>
        <strong>{product.name}</strong>
        <em>£{product.price}</em>
      </span>
      <ChevronRight />
    </button>
  );
}

function ProductRow({
  product,
  saved,
  onOpen,
  onSave,
}: {
  product: Product;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  return (
    <article className="product-row">
      <button
        className="product-row-art"
        onClick={onOpen}
        aria-label={`View ${product.name}`}
        style={{
          background: `linear-gradient(145deg, color-mix(in srgb, ${product.shadeColor} 55%, #fff), ${product.shadeColor})`,
        }}
      >
        <i />
      </button>
      <button className="product-row-copy" onClick={onOpen}>
        <small>{product.brand}</small>
        <strong>{product.name}</strong>
        <span>{product.shade}</span>
        <em>£{product.price}</em>
      </button>
      <button
        className="icon-button quiet"
        onClick={onSave}
        aria-label={saved ? `Remove ${product.name}` : `Save ${product.name}`}
      >
        <Bookmark className={saved ? "filled-icon" : ""} />
      </button>
    </article>
  );
}

function ProductSheet({
  product,
  saved,
  onClose,
  onSave,
  onTry,
  onShop,
  onSelectShade,
  openCreator,
}: {
  product: Product;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onTry: () => void;
  onShop: () => void;
  onSelectShade: (product: Product) => void;
  openCreator: (creator: Creator) => void;
}) {
  const creator = product.creatorId
    ? creatorById(product.creatorId)
    : undefined;
  const shadeMates = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);

  return (
    <BottomSheet title="Product detail" onClose={onClose} wide>
      <div className="product-detail-grid">
        <div
          className="product-hero-art"
          style={{
            background: `radial-gradient(circle at 65% 22%, #fff9, transparent 16%), linear-gradient(145deg, color-mix(in srgb, ${product.shadeColor} 48%, #f8eee6), ${product.shadeColor})`,
          }}
        >
          <span>{product.brand}</span>
          <div className="product-object">
            <i>{product.name}</i>
          </div>
          <small>Fictional product / demo only</small>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <div className="product-title-row">
            <h2>{product.name}</h2>
            <button
              className="icon-button outlined"
              onClick={onSave}
              aria-label={saved ? "Remove from saved" : "Save product"}
            >
              <Bookmark className={saved ? "filled-icon" : ""} />
            </button>
          </div>
          <div className="rating-line">
            <Star className="filled-icon" />
            <strong>{product.rating}</strong>
            <span>{product.reviews} reviews</span>
            <em>£{product.price}</em>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="benefit">
            <Sparkles />
            <span>
              <small>Why it stands out</small>
              <strong>{product.benefit}</strong>
            </span>
          </div>
          <div className="shade-picker">
            <span>Selected: <strong>{product.shade}</strong></span>
            <div>
              <button
                className="active"
                style={{ background: product.shadeColor }}
                aria-label={`${product.shade}, selected`}
              />
              {shadeMates.map((item) => (
                <button
                  key={item.id}
                  style={{ background: item.shadeColor }}
                  aria-label={item.shade}
                  onClick={() => onSelectShade(item)}
                />
              ))}
            </div>
          </div>
          {creator && (
            <button
              className="creator-inline"
              onClick={() => openCreator(creator)}
            >
              <Image src={creator.image} alt="" width={42} height={42} />
              <span>
                <small>Featured by</small>
                <strong>{creator.name}</strong>
              </span>
              <ChevronRight />
            </button>
          )}
          <div className="product-detail-actions">
            <button className="secondary-button" onClick={onTry}>
              <WandSparkles />
              Try it
            </button>
            <button className="primary-button" onClick={onShop}>
              <ShoppingBag />
              Shop product · £{product.price}
            </button>
          </div>
          <p className="affiliate-note">
            Demo affiliate link. The recommending creator may earn a commission
            from a future purchase, at no extra cost to you.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

function CreatorSheet({
  creator,
  onClose,
  tryLook,
  notify,
}: {
  creator: Creator;
  onClose: () => void;
  tryLook: (id: string) => void;
  notify: (message: string) => void;
}) {
  const creatorLooks = looks.filter((look) => look.creatorId === creator.id);
  return (
    <BottomSheet title="Artist profile" onClose={onClose} wide>
      <div className="creator-profile">
        <div className="creator-profile-head">
          <Image
            src={creator.image}
            alt={creator.name}
            width={112}
            height={112}
          />
          <div>
            <p className="eyebrow">Glowdesk artist</p>
            <h2>{creator.name}</h2>
            <span>{creator.handle}</span>
          </div>
          <button
            className="secondary-button"
            onClick={() => notify(`Following ${creator.name}`)}
          >
            Follow
          </button>
        </div>
        <p className="creator-bio">{creator.bio}</p>
        <div className="creator-stats">
          <span><strong>{creator.followers}</strong> followers</span>
          <span><strong>{creatorLooks.length}</strong> edits</span>
          <span><strong>4.9</strong> community rating</span>
        </div>
        <div className="creator-specialty">
          <Sparkles />
          {creator.specialty}
        </div>
        <div className="creator-look-grid">
          {creatorLooks.map((look) => (
            <button key={look.id} onClick={() => tryLook(look.id)}>
              <Image src={look.image} alt={look.title} fill sizes="220px" />
              <span>
                <small>{look.mood}</small>
                <strong>{look.title}</strong>
                <em>Try edit <ArrowRight /></em>
              </span>
            </button>
          ))}
        </div>
        <p className="affiliate-note creator-disclosure">
          Shoppable edit disclosure: creator attribution remains attached to
          recommended products. Commission tracking is mocked in this MVP.
        </p>
      </div>
    </BottomSheet>
  );
}

function BottomSheet({
  title,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="sheet-layer" role="presentation">
      <button
        className="sheet-backdrop"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <section
        className={cx("bottom-sheet", wide && "bottom-sheet-wide")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header>
          <span>{title}</span>
          <button
            className="icon-button quiet"
            onClick={onClose}
            aria-label={`Close ${title}`}
            autoFocus
          >
            <X />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </section>
    </div>
  );
}

function Onboarding({
  step,
  onNext,
  onSkip,
}: {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const item = onboarding[step];
  return (
    <section
      className="onboarding"
      aria-label={`Welcome to Glowdesk, step ${step + 1} of ${onboarding.length}`}
    >
      <div className="onboarding-image">
        <Image
          src={item.image}
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div
          className="onboarding-colour"
          style={{ "--onboarding-accent": item.accent } as CSSProperties}
        />
        <header>
          <span className="wordmark">
            glow<em>desk</em>
          </span>
          <button onClick={onSkip}>Skip</button>
        </header>
        <div className="onboarding-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="onboarding-copy">
        <div className="onboarding-progress" aria-hidden="true">
          {onboarding.map((_, index) => (
            <span key={index} className={index === step ? "active" : undefined} />
          ))}
        </div>
        <p className="eyebrow">{item.eyebrow}</p>
        <h1>{item.title}</h1>
        <p>{item.copy}</p>
        <button className="primary-button" onClick={onNext}>
          {step === onboarding.length - 1 ? "Open my studio" : "Continue"}
          <ArrowRight />
        </button>
        <span className="privacy-note">
          <ScanFace />
          Selfies stay on this device in the MVP.
        </span>
      </div>
    </section>
  );
}

function ChevronUp() {
  return <ChevronDown className="chevron-up" />;
}

function ArrowRight() {
  return <ChevronRight />;
}
