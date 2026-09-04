"use client";

import {
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Heart,
  ImagePlus,
  Info,
  Inbox,
  Link2,
  Menu,
  MessageCircle,
  MoreHorizontal,
  RefreshCcw,
  RotateCcw,
  ScanFace,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
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
import {
  demoConsultations,
  featuredProfessional,
  type ConsultationBrief,
  type ConsultationStatus,
  type Service,
} from "@/data/practice";

type View = "camera" | "discover" | "consultation" | "professional";
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
    eyebrow: "Maya's digital studio",
    title: "Start the conversation visually.",
    copy: "Explore the looks, services, and products Maya has curated for her clients.",
    image: "/images/look-sudan.jpg",
    accent: "#a9bea8",
  },
  {
    eyebrow: "Your face, your edit",
    title: "Try it before you explain it.",
    copy: "Use your own photo to explore colour, skincare goals, and complete looks.",
    image: "/images/look-afro.jpg",
    accent: "#ff6c75",
  },
  {
    eyebrow: "A better consultation",
    title: "Send Maya what you mean.",
    copy: "Collect your favourites into a private visual brief before your appointment.",
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
  const [consultationSheetOpen, setConsultationSheetOpen] = useState(false);
  const [consultationSent, setConsultationSent] = useState(false);
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
      if (window.localStorage.getItem("glowdesk-consultation-sent")) {
        setConsultationSent(true);
      }
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
            active={view === "consultation"}
            icon={<ClipboardList />}
            label="Brief"
            onClick={() => setView("consultation")}
          />
          <NavButton
            active={view === "professional"}
            icon={<BriefcaseBusiness />}
            label="Pro"
            onClick={() => setView("professional")}
          />
        </nav>
        <button
          className="rail-profile"
          onClick={() => setView("discover")}
          aria-label={`Open ${featuredProfessional.name}'s storefront`}
        >
          <Image
            src={featuredProfessional.image}
            alt=""
            width={44}
            height={44}
            style={{ width: 44, height: 44 }}
          />
        </button>
      </aside>

      <header className="mobile-header">
        <button
          className="mobile-professional"
          onClick={() => setView("discover")}
          aria-label={`Open ${featuredProfessional.name}'s storefront`}
        >
          <Image
            src={featuredProfessional.image}
            alt=""
            width={34}
            height={34}
            style={{ width: 34, height: 34 }}
          />
          <span>
            <strong>{featuredProfessional.name}</strong>
            <small>Powered by glowdesk</small>
          </span>
        </button>
        <button
          className="icon-button quiet"
          aria-label="Open menu"
          onClick={() => setView("professional")}
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
        {view === "consultation" && (
          <ConsultationBuilder
            saved={saved}
            tryLook={tryLook}
            openProduct={setProductSheet}
            toggleLook={toggleLook}
            toggleProduct={toggleProduct}
            sent={consultationSent}
            onReview={() => setConsultationSheetOpen(true)}
            onBrowse={() => setView("discover")}
          />
        )}
        {view === "professional" && (
          <ProfessionalWorkspace
            notify={setToast}
            openProduct={setProductSheet}
            onClientPreview={() => setView("discover")}
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
          active={view === "consultation"}
          icon={<ClipboardList />}
          label="Brief"
          onClick={() => setView("consultation")}
        />
        <NavButton
          active={view === "professional"}
          icon={<BriefcaseBusiness />}
          label="Pro"
          onClick={() => setView("professional")}
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

      {consultationSheetOpen && (
        <ConsultationSheet
          saved={saved}
          onClose={() => setConsultationSheetOpen(false)}
          onSend={() => {
            window.localStorage.setItem("glowdesk-consultation-sent", "true");
            setConsultationSheetOpen(false);
            setConsultationSent(true);
            setToast(`Brief sent securely to ${featuredProfessional.name}`);
          }}
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

function ProfessionalSignature({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cx("professional-signature", compact && "compact")}>
      <Image
        src={featuredProfessional.image}
        alt=""
        width={compact ? 46 : 64}
        height={compact ? 46 : 64}
        style={{
          width: compact ? 46 : 64,
          height: compact ? 46 : 64,
        }}
      />
      <span>
        <small>{featuredProfessional.studioName}</small>
        <strong>
          {featuredProfessional.name}
          <BadgeCheck aria-label="Verified Glowdesk professional" />
        </strong>
        <em>{featuredProfessional.role}</em>
      </span>
    </div>
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
        <ProfessionalSignature compact />
        <p className="eyebrow">Your private consultation studio</p>
        <h1>Show Maya<br />what you mean.</h1>
        <p>
          Try a look, capture the ideas that feel right, and send a visual brief
          before your appointment.
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
              label="Brief"
              active={saved.looks.includes(activeLook.id)}
              onClick={() => {
                toggleLook(activeLook.id);
                notify(
                  saved.looks.includes(activeLook.id)
                    ? "Removed from your brief"
                    : "Added to your consultation brief",
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
                  if (!saved.looks.includes(activeLook.id)) {
                    toggleLook(activeLook.id);
                  }
                  window.setTimeout(() => setCapturing(false), 500);
                  notify("Preview added to your consultation");
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
          <span className="eyebrow">Maya&apos;s current edit</span>
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
          Maya may earn commission from recommended products. Your price stays
          the same.
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
      <div className="storefront-hero">
        <div className="storefront-profile">
          <ProfessionalSignature />
          <p>{featuredProfessional.bio}</p>
          <div className="storefront-meta">
            <span>{featuredProfessional.location}</span>
            <span>{featuredProfessional.handle}</span>
          </div>
          <button
            className="primary-button"
            onClick={() => notify("Booking handoff previewed — no appointment made")}
          >
            <CalendarDays />
            Book with Maya
          </button>
        </div>
        <div className="service-strip">
          {featuredProfessional.services.map((service) => (
            <article key={service.id}>
              <span>{service.duration}</span>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <strong>{service.price}</strong>
            </article>
          ))}
        </div>
        <p className="powered-mark">
          <Sparkles />
          Professional storefront powered by glowdesk
        </p>
      </div>
      <header className="page-heading">
        <div>
          <p className="eyebrow">Curated for Maya&apos;s clients</p>
          <h1>Find the words<br />in a look.</h1>
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
                  label="Ask Maya"
                  onClick={() => notify("Added a note prompt for Maya")}
                />
              </div>
              <div className="feed-content">
                <p className="eyebrow">{look.mood} / selected by Maya</p>
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
                    Try for my brief
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

function ConsultationBuilder({
  saved,
  tryLook,
  openProduct,
  toggleLook,
  toggleProduct,
  sent,
  onReview,
  onBrowse,
}: {
  saved: SavedState;
  tryLook: (id: string) => void;
  openProduct: (product: Product) => void;
  toggleLook: (id: string) => void;
  toggleProduct: (id: string) => void;
  sent: boolean;
  onReview: () => void;
  onBrowse: () => void;
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
    <section className="saved-page consultation-page">
      <header className="page-heading saved-heading">
        <div>
          <p className="eyebrow">Appointment prep</p>
          <h1>Your visual<br />consultation.</h1>
        </div>
        <div className="saved-count">
          <strong>{saved.looks.length + saved.products.length}</strong>
          <span>ideas</span>
        </div>
      </header>
      <div className="brief-intro">
        <ProfessionalSignature compact />
        <div>
          <p className="eyebrow">A clearer starting point</p>
          <h2>Show Maya the finish, feeling, and products you have in mind.</h2>
          <p>
            Your selected looks and captures become a private brief Maya can
            review before your appointment.
          </p>
        </div>
        {sent ? (
          <div className="brief-sent">
            <Check />
            <span>
              <strong>Brief sent</strong>
              <small>Maya will review it before your appointment.</small>
            </span>
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={onReview}
            disabled={!saved.looks.length}
          >
            <Send />
            Review and send
          </button>
        )}
      </div>
      <ol className="brief-steps">
        <li className="active"><span>1</span>Collect inspiration</li>
        <li className={saved.looks.length ? "active" : undefined}><span>2</span>Add appointment notes</li>
        <li className={sent ? "active" : undefined}><span>3</span>Send securely</li>
      </ol>
      <div className="saved-tabs" role="tablist" aria-label="Saved content">
        {(["looks", "products", "recent"] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : undefined}
            onClick={() => setTab(item)}
          >
            {item === "recent" ? "Captured previews" : item}
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
          <h2>Your brief starts with one idea.</h2>
          <p>Browse Maya&apos;s edits, try a look, and add what feels right.</p>
          <button className="secondary-button" onClick={onBrowse}>
            Browse Maya&apos;s looks
          </button>
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

function ConsultationSheet({
  saved,
  onClose,
  onSend,
}: {
  saved: SavedState;
  onClose: () => void;
  onSend: () => void;
}) {
  const [serviceId, setServiceId] = useState("occasion");
  const [name, setName] = useState("Leah Morgan");
  const [email, setEmail] = useState("leah@example.com");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState(
    "I want something polished and warm, but I still want my skin to look like skin.",
  );
  const [consented, setConsented] = useState(false);
  const selectedLooks = saved.looks
    .map(lookById)
    .filter((look): look is Look => Boolean(look));
  const selectedProducts = saved.products
    .map(productById)
    .filter((product): product is Product => Boolean(product));

  return (
    <BottomSheet title="Send your consultation" onClose={onClose} wide>
      <div className="consultation-review">
        <div className="consultation-review-copy">
          <p className="eyebrow">Private brief for Maya</p>
          <h2>Give your appointment a better starting point.</h2>
          <p>
            Maya will receive your inspiration, selected products, and notes in
            one place before you meet.
          </p>
          <div className="consultation-look-strip">
            {selectedLooks.slice(0, 4).map((look) => (
              <Image
                key={look.id}
                src={look.image}
                alt={look.title}
                width={92}
                height={118}
              />
            ))}
            <span>
              <strong>{selectedLooks.length}</strong> looks
              <small>{selectedProducts.length} products saved</small>
            </span>
          </div>
          <div className="privacy-card">
            <ShieldCheck />
            <span>
              <strong>Shared only with Maya&apos;s studio</strong>
              <small>
                Demo images remain on this device. A live service requires
                explicit image consent and deletion controls.
              </small>
            </span>
          </div>
        </div>
        <form
          className="consultation-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSend();
          }}
        >
          <fieldset>
            <legend>What are you planning?</legend>
            <div className="service-options">
              {featuredProfessional.services.map((service) => (
                <ServiceOption
                  key={service.id}
                  service={service}
                  selected={serviceId === service.id}
                  onSelect={() => setServiceId(service.id)}
                />
              ))}
            </div>
          </fieldset>
          <div className="form-row">
            <label>
              Your name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
          </div>
          <p className="account-note">
            No account is needed to browse. These details create a private link
            so you can return to Maya&apos;s reply.
          </p>
          <label>
            Appointment or occasion date
            <input
              type="date"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
            />
          </label>
          <label>
            What should Maya know?
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
            />
          </label>
          <label className="consent-check">
            <input
              type="checkbox"
              checked={consented}
              onChange={(event) => setConsented(event.target.checked)}
            />
            <span>
              I consent to sharing this brief and its selected images with Maya
              Clarke Skin &amp; Beauty for consultation purposes.
            </span>
          </label>
          <button
            className="primary-button consultation-send"
            type="submit"
            disabled={!consented || !name || !email}
          >
            <Send />
            Send securely to Maya
          </button>
          <p className="affiliate-note">
            Maya may recommend products using disclosed affiliate links. You
            choose whether to purchase.
          </p>
        </form>
      </div>
    </BottomSheet>
  );
}

function ServiceOption({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={cx("service-option", selected && "active")}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span>
        <strong>{service.name}</strong>
        <small>{service.duration}</small>
      </span>
      <em>{service.price}</em>
      {selected && <Check />}
    </button>
  );
}

function ProfessionalWorkspace({
  notify,
  openProduct,
  onClientPreview,
}: {
  notify: (message: string) => void;
  openProduct: (product: Product) => void;
  onClientPreview: () => void;
}) {
  const [consultations, setConsultations] =
    useState<ConsultationBrief[]>(demoConsultations);
  const [activeId, setActiveId] = useState(demoConsultations[0].id);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    demoConsultations[0].productIds,
  );
  const [recommendationNote, setRecommendationNote] = useState(
    "I’d keep the base sheer, warm the cheeks, and bring definition through the eyes. These shades will photograph beautifully without feeling heavy.",
  );
  const active =
    consultations.find((consultation) => consultation.id === activeId) ??
    consultations[0];
  const activeService =
    featuredProfessional.services.find(
      (service) => service.id === active.serviceId,
    ) ?? featuredProfessional.services[0];
  const professionalProducts = products.filter((product) =>
    featuredProfessional.enabledBrands.includes(product.brand),
  );

  const setStatus = (status: ConsultationStatus) => {
    setConsultations((current) =>
      current.map((consultation) =>
        consultation.id === active.id ? { ...consultation, status } : consultation,
      ),
    );
  };

  const selectConsultation = (consultation: ConsultationBrief) => {
    setActiveId(consultation.id);
    setSelectedProducts(consultation.productIds);
    setRecommendationNote(
      consultation.serviceId === "skin-consult"
        ? "I’d simplify the routine first and focus on comfort and consistency. We can review how your skin feels at the appointment."
        : "I’d keep the finish dimensional and comfortable, then tailor the intensity together at the appointment.",
    );
    if (consultation.status === "new") {
      setConsultations((current) =>
        current.map((item) =>
          item.id === consultation.id
            ? { ...item, status: "reviewing" as const }
            : item,
        ),
      );
    }
  };

  return (
    <section className="professional-workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Professional workspace · demo</p>
          <h1>Good morning,<br />Maya.</h1>
          <p>Turn client inspiration into a confident appointment plan.</p>
        </div>
        <div className="workspace-profile">
          <ProfessionalSignature compact />
          <button className="secondary-button" onClick={onClientPreview}>
            View client storefront
            <ChevronRight />
          </button>
        </div>
      </header>

      <div className="workspace-metrics" aria-label="Practice summary">
        <article>
          <Inbox />
          <span><strong>3</strong> open briefs</span>
          <small>2 need a response</small>
        </article>
        <article>
          <CalendarDays />
          <span><strong>7</strong> appointments</span>
          <small>this week</small>
        </article>
        <article>
          <Link2 />
          <span><strong>18</strong> product clicks</span>
          <small>from recommendations</small>
        </article>
      </div>

      <div className="workspace-grid">
        <aside className="consultation-inbox">
          <div className="inbox-heading">
            <div>
              <p className="eyebrow">Consultation inbox</p>
              <h2>Client briefs</h2>
            </div>
            <button
              className="icon-button outlined"
              aria-label="Consultation filters"
              onClick={() => notify("Showing all open consultations")}
            >
              <SlidersHorizontal />
            </button>
          </div>
          <div className="inbox-list">
            {consultations.map((consultation) => {
              const service =
                featuredProfessional.services.find(
                  (item) => item.id === consultation.serviceId,
                ) ?? featuredProfessional.services[0];
              return (
                <button
                  key={consultation.id}
                  className={cx(
                    "inbox-item",
                    active.id === consultation.id && "active",
                  )}
                  onClick={() => selectConsultation(consultation)}
                >
                  <span className="client-initials">
                    {consultation.initials}
                  </span>
                  <span className="inbox-copy">
                    <strong>{consultation.clientName}</strong>
                    <small>{service.name} · {consultation.eventDate}</small>
                    <em>{consultation.note}</em>
                  </span>
                  <span className={cx("status-pill", `status-${consultation.status.replace(" ", "-")}`)}>
                    {consultation.status}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="consultation-detail">
          <header className="consultation-detail-head">
            <div>
              <p className="eyebrow">{active.id} · {active.source}</p>
              <h2>{active.clientName}</h2>
              <span>{activeService.name} · {active.eventDate}</span>
            </div>
            <span className={cx("status-pill", `status-${active.status.replace(" ", "-")}`)}>
              {active.status}
            </span>
          </header>

          <div className="client-note">
            <MessageCircle />
            <p>“{active.note}”</p>
          </div>

          <section className="client-inspiration">
            <div className="section-title">
              <div>
                <p className="eyebrow">Client inspiration</p>
                <h3>{active.lookIds.length} looks in the brief</h3>
              </div>
              <span><Clock3 /> Sent {active.submittedAt}</span>
            </div>
            <div className="client-look-grid">
              {active.lookIds.map((lookId) => {
                const look = lookById(lookId);
                if (!look) return null;
                return (
                  <div key={look.id}>
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      sizes="(max-width: 767px) 46vw, 240px"
                    />
                    <span>{look.title}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="recommendation-builder">
            <div className="section-title">
              <div>
                <p className="eyebrow">Recommendation builder</p>
                <h3>Shape Maya&apos;s edit</h3>
              </div>
              <button
                className="text-button"
                onClick={() => notify("Brand catalog settings previewed")}
              >
                <SettingsLabel />
              </button>
            </div>
            <div className="enabled-brands">
              <span>Enabled brands</span>
              {featuredProfessional.enabledBrands.map((brand) => (
                <em key={brand}>{brand}</em>
              ))}
            </div>
            <div className="recommendation-products">
              {professionalProducts.slice(0, 8).map((product) => {
                const selected = selectedProducts.includes(product.id);
                return (
                  <button
                    key={product.id}
                    className={selected ? "active" : undefined}
                    onClick={() =>
                      setSelectedProducts((current) =>
                        selected
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id],
                      )
                    }
                    aria-pressed={selected}
                  >
                    <span style={{ background: product.shadeColor }} />
                    <strong>{product.name}</strong>
                    <small>{product.brand} · £{product.price}</small>
                    {selected && <Check />}
                  </button>
                );
              })}
            </div>
            <label>
              Note to {active.clientName.split(" ")[0]}
              <textarea
                value={recommendationNote}
                onChange={(event) => setRecommendationNote(event.target.value)}
                rows={4}
              />
            </label>
            <div className="recommendation-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  const first = selectedProducts
                    .map(productById)
                    .find((product): product is Product => Boolean(product));
                  if (first) openProduct(first);
                  else notify("Choose a product to preview");
                }}
              >
                Preview client view
              </button>
              <button
                className="primary-button"
                disabled={!selectedProducts.length}
                onClick={() => {
                  setStatus("recommendation sent");
                  notify(`Recommendation sent to ${active.clientName}`);
                }}
              >
                <Send />
                Send recommendation
              </button>
            </div>
            <p className="affiliate-note">
              Affiliate disclosure is attached automatically to every
              shoppable recommendation. Commission tracking is mocked.
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}

function SettingsLabel() {
  return (
    <>
      Manage catalog
      <ChevronRight />
    </>
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
          <div className="professional-recommendation">
            <Image
              src={featuredProfessional.image}
              alt=""
              width={42}
              height={42}
              style={{ width: 42, height: 42 }}
            />
            <span>
              <small>Available from Maya&apos;s preferred catalog</small>
              <strong>{featuredProfessional.studioName}</strong>
            </span>
            <BadgeCheck />
          </div>
          <div className="product-detail-actions">
            <button className="secondary-button" onClick={onTry}>
              <WandSparkles />
              Try it
            </button>
            <button className="primary-button" onClick={onShop}>
              <ShoppingBag />
              Shop Maya&apos;s pick · £{product.price}
            </button>
          </div>
          <p className="affiliate-note">
            Demo affiliate link. Maya may earn a commission from a future
            purchase, at no extra cost to you.
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
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="sheet-layer" role="presentation">
      <div
        className="sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        ref={dialogRef}
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
          sizes="(min-width: 768px) 54vw, 100vw"
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
          {step === onboarding.length - 1 ? "Enter Maya's studio" : "Continue"}
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
