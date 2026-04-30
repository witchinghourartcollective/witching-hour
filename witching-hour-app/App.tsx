import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Audio } from "expo-av";
import {
  HOUR_TOKEN_ADDRESS,
  HOUR_TOKEN_CHAIN,
  HOUR_TOKEN_METADATA,
} from "../../../witching-hour-token/src/integration/hourToken";

const ROOMS = [
  {
    id: "entry",
    title: "The Entry",
    description: "A ritual threshold for drops, private access, and collector identity.",
    mood: "Black glass, violet static, and a low green signal."
  },
  {
    id: "shop",
    title: "The Shop Floor",
    description: "Commercial structure with the scan rhythm of a strong Shopify homepage.",
    mood: "A clean product cadence under underground light."
  },
  {
    id: "access",
    title: "Access",
    description: "Genesis keys, utility tiers, and a direct entry message.",
    mood: "An invitation, not a product page."
  },
  {
    id: "studio",
    title: "Studio",
    description: "Bookings, commissions, and production offers with clear conversion paths.",
    mood: "Warm ember light across precision gear."
  }
] as const;

const TRACKS = [
  {
    id: "whm-001",
    title: "Witching Hour - Session 001",
    artist: "Witching Hour",
    previewUrl: null as string | null
  }
];

const PRODUCTS = [
  {
    id: "drop-1",
    category: "Collector Access",
    title: "Genesis Key",
    price: "0.0333 ETH",
    note: "333 fixed. Early access to music, visual work, and private sessions."
  },
  {
    id: "drop-2",
    category: "Physical / Digital",
    title: "Studio Object 001",
    price: "$180",
    note: "A storefront slot for prints, ritual hardware, or limited merch."
  },
  {
    id: "drop-3",
    category: "Music Drop",
    title: "Signal Pack",
    price: "$44",
    note: "Exclusive stems, unreleased audio, and collector notes."
  }
];

const ACCESS_COLUMNS = [
  {
    id: "access-1",
    title: "Genesis",
    detail: "333 keys",
    status: "Foundation / Origin"
  },
  {
    id: "access-2",
    title: "Alignment",
    detail: "777 keys",
    status: "Expansion / Momentum"
  },
  {
    id: "access-3",
    title: "Ritual",
    detail: "666 keys",
    status: "Selective / Edge"
  }
];

const TOKEN_SUMMARY = [
  { label: "Symbol", value: HOUR_TOKEN_METADATA.symbol },
  { label: "Chain", value: HOUR_TOKEN_CHAIN.name },
  { label: "Network", value: `Chain ${HOUR_TOKEN_CHAIN.id}` },
  { label: "Contract", value: HOUR_TOKEN_ADDRESS },
  { label: "Trading", value: "Not live yet" },
] as const;

const OFFERINGS = [
  {
    id: "offer-1",
    title: "Studio Session",
    price: "$350",
    detail: "3 hours, tracking + mix notes."
  },
  {
    id: "offer-2",
    title: "Commission",
    price: "$750",
    detail: "Custom soundscape, 2 rounds."
  },
  {
    id: "offer-3",
    title: "Live Ritual",
    price: "$1,800",
    detail: "Performance + installation."
  }
];

const THEME = {
  ink: "#07060b",
  void: "#0d0b14",
  smoke: "#151224",
  violet: "#7a4aa8",
  magenta: "#b44fff",
  ember: "#c04a3a",
  greenGlow: "#7cffc6",
  goldGlow: "#e6c97a",
  ash: "#cfc7d8",
  mist: "#9a92a8",
  white: "#f6f1ff"
};

const BASE_MAINNET_PARAMS = {
  chainId: "0x2105",
  chainName: "Base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"]
};

type InjectedProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export default function App() {
  const [roomId, setRoomId] = useState<(typeof ROOMS)[number]["id"]>(ROOMS[0].id);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [baseAddress, setBaseAddress] = useState<string | null>(null);
  const [baseStatus, setBaseStatus] = useState("Wallet not connected");
  const [baseError, setBaseError] = useState<string | null>(null);
  const [baseBusy, setBaseBusy] = useState(false);
  const travel = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const logoutFade = useRef(new Animated.Value(0)).current;

  const currentRoom = useMemo(
    () => ROOMS.find((room) => room.id === roomId) ?? ROOMS[0],
    [roomId]
  );

  const track = TRACKS[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 3800,
          useNativeDriver: true
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 3800,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [shimmer]);

  useEffect(() => {
    travel.setValue(0);
    Animated.timing(travel, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true
    }).start();
    setTransitionKey((prev) => prev + 1);
  }, [roomId, travel]);

  useEffect(() => {
    Animated.timing(logoutFade, {
      toValue: loggingOut ? 1 : 0,
      duration: 600,
      useNativeDriver: true
    }).start();
  }, [loggingOut, logoutFade]);

  const handleLogOut = () => {
    setLoggingOut(true);
  };

  const handleReenter = () => {
    setLoggingOut(false);
  };

  const handleBaseSignIn = async () => {
    if (Platform.OS !== "web") {
      setBaseError("Use the web preview for wallet connection.");
      setBaseStatus("Open the web build to connect.");
      return;
    }

    const provider = (
      globalThis as typeof globalThis & {
        ethereum?: InjectedProvider;
      }
    ).ethereum;

    if (!provider) {
      setBaseError("No injected wallet found. Install Coinbase Wallet or MetaMask.");
      setBaseStatus("Wallet unavailable");
      return;
    }

    setBaseBusy(true);
    setBaseError(null);
    setBaseStatus("Connecting to Base...");

    try {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_MAINNET_PARAMS.chainId }]
        });
      } catch {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [BASE_MAINNET_PARAMS]
        });
      }

      const accounts = (await provider.request({
        method: "eth_requestAccounts"
      })) as string[];

      const address = accounts?.[0];
      if (!address) {
        throw new Error("No wallet address returned.");
      }

      setBaseAddress(address);
      setBaseStatus("Connected on Base");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Wallet connection failed";
      setBaseError(message);
      setBaseStatus("Wallet not connected");
    } finally {
      setBaseBusy(false);
    }
  };

  const handleTogglePlayback = async () => {
    if (!track.previewUrl) {
      setPlaying((prev) => !prev);
      return;
    }

    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.previewUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlaying(true);
      return;
    }

    if (playing) {
      await sound.pauseAsync();
      setPlaying(false);
      return;
    }

    await sound.playAsync();
    setPlaying(true);
  };

  const { width } = Dimensions.get("window");
  const roomTranslate = travel.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.45, 0]
  });
  const roomRotate = travel.interpolate({
    inputRange: [0, 1],
    outputRange: ["-8deg", "0deg"]
  });
  const roomOpacity = travel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20]
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.topBar}>
            <Text style={styles.brandMark}>WHM</Text>
            <View style={styles.navRow}>
              <Text style={styles.navItem}>About</Text>
              <Text style={styles.navItem}>Access</Text>
              <Text style={styles.navItem}>Drops</Text>
              <Text style={styles.navItem}>Studio</Text>
            </View>
          </View>
          <Text style={styles.eyebrow}>Witching Hour Music</Text>
          <Text style={styles.title}>Signal, Symbol, System.</Text>
          <Text style={styles.subtitle}>
            A ritual storefront built with the visual language of
            `witchinghourmac.com` and the scan rhythm of a Shopify front page.
          </Text>
          <Text style={styles.manifesto}>
            This is not passive content. This is an access point for music,
            collector objects, private drops, and real studio work.
          </Text>
          <View style={styles.heroActions}>
            <Pressable
              style={styles.primaryHeroButton}
              onPress={() => Linking.openURL("https://witchinghourmac.com")}
            >
              <Text style={styles.primaryHeroButtonText}>Enter Main Site</Text>
            </Pressable>
            <Pressable style={styles.secondaryHeroButton} onPress={handleBaseSignIn}>
              <Text style={styles.secondaryHeroButtonText}>
                {baseBusy ? "Connecting..." : "Connect on Base"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterLabel}>Wallet</Text>
            <Text style={styles.heroFooterValue}>
              {baseAddress ?? "No wallet connected"}
            </Text>
          </View>
          {baseError ? <Text style={styles.baseError}>{baseError}</Text> : null}
        </View>

        <View style={styles.roomStrip}>
          {ROOMS.map((room) => (
            <Pressable
              key={room.id}
              onPress={() => setRoomId(room.id)}
              style={[
                styles.roomChip,
                room.id === roomId && styles.roomChipActive
              ]}
            >
              <Text
                style={[
                  styles.roomChipText,
                  room.id === roomId && styles.roomChipTextActive
                ]}
              >
                {room.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sceneFrame}>
          <Animated.View
            key={transitionKey}
            style={[
              styles.sceneRoom,
              {
                opacity: roomOpacity,
                transform: [
                  { perspective: 900 },
                  { translateX: roomTranslate },
                  { rotateY: roomRotate }
                ]
              }
            ]}
          >
            <View style={styles.sceneBackdrop} />
            <View style={styles.sceneWallLeft} />
            <View style={styles.sceneWallRight} />
            <View style={styles.sceneWallBack} />
            <View style={styles.sceneWindow} />
            <View style={styles.sceneFloor} />
            <Animated.View
              style={[
                styles.sceneGlow,
                { transform: [{ translateX: shimmerTranslate }] }
              ]}
            />
            <View style={styles.sceneContent}>
              <Text style={styles.roomTitle}>{currentRoom.title}</Text>
              <Text style={styles.roomDesc}>{currentRoom.description}</Text>
              <Text style={styles.roomMood}>{currentRoom.mood}</Text>
              <View style={styles.roomActions}>
                <Text style={styles.roomHint}>
                  Move across surfaces to preview the site architecture.
                </Text>
                <Pressable style={styles.exitButton} onPress={handleLogOut}>
                  <Text style={styles.exitButtonText}>Exit the House</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Token State</Text>
          <Text style={styles.sectionCopy}>
            The app now reads from the tracked token integration constants, so
            the UI stays aligned with the token repo.
          </Text>
          <View style={styles.baseCard}>
            <View style={styles.baseMeta}>
              {TOKEN_SUMMARY.map((item) => (
                <View key={item.label} style={styles.tokenRow}>
                  <Text style={styles.baseLabel}>{item.label}</Text>
                  <Text style={styles.baseStatus}>{item.value}</Text>
                </View>
              ))}
              <Text style={styles.baseHint}>
                Keep this state as the source of truth until liquidity is live
                and `tradingEnabled` flips on-chain.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collector Access</Text>
          <Text style={styles.sectionCopy}>
            The copy is sparse and direct, matching the live site&apos;s tone:
            access first, hype nowhere.
          </Text>
          <View style={styles.baseCard}>
            <View style={styles.baseMeta}>
              <Text style={styles.baseLabel}>Status</Text>
              <Text style={styles.baseStatus}>{baseStatus}</Text>
              <Text style={styles.baseHint}>
                {baseAddress
                  ? `Connected wallet: ${baseAddress}`
                  : "Connect an injected wallet and switch it onto Base Mainnet. This keeps the localhost preview compatible with Expo web and avoids the import.meta crash."}
              </Text>
            </View>
            <Pressable
              style={[styles.baseButton, baseBusy && styles.baseButtonDisabled]}
              disabled={baseBusy}
              onPress={handleBaseSignIn}
            >
              <Text style={styles.baseButtonText}>
                {baseBusy
                  ? "Connecting..."
                  : baseAddress
                    ? "Reconnect Wallet"
                    : "Connect on Base"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Drops</Text>
          <Text style={styles.sectionCopy}>
            Product-card cadence inspired by Shopify: fast scan, strong price
            anchor, clear category label, and immediate CTA potential.
          </Text>
          <View style={styles.grid}>
            {PRODUCTS.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
                <Text style={styles.productNote}>{product.note}</Text>
                <Pressable style={styles.productButton}>
                  <Text style={styles.productButtonText}>View Drop</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound Chamber</Text>
          <Text style={styles.sectionCopy}>
            Music still sits near the commercial surfaces so the storefront
            remains Witching Hour rather than a generic catalog.
          </Text>
          <View style={styles.playerCard}>
            <View style={styles.playerMeta}>
              <Text style={styles.playerTitle}>{track.title}</Text>
              <Text style={styles.playerArtist}>{track.artist}</Text>
            </View>
            <Pressable style={styles.playerButton} onPress={handleTogglePlayback}>
              <Text style={styles.playerButtonText}>
                {playing ? "Pause Preview" : "Play Preview"}
              </Text>
            </Pressable>
          </View>
          {!track.previewUrl ? (
            <Text style={styles.playerNote}>
              Add a preview URL in `TRACKS` to enable real playback.
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Access Structure</Text>
          <Text style={styles.sectionCopy}>
            One clear structure per drop. No gimmicks. No dilution. No generic
            NFT dashboard language.
          </Text>
          {ACCESS_COLUMNS.map((column) => (
            <View key={column.id} style={styles.accessRow}>
              <View>
                <Text style={styles.accessTitle}>{column.title}</Text>
                <Text style={styles.accessMeta}>{column.detail}</Text>
              </View>
              <Text style={styles.accessStatus}>{column.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookings + Commissions</Text>
          <Text style={styles.sectionCopy}>
            Commercial offers sit below the mythic brand layer, the same way a
            strong storefront separates identity from checkout friction.
          </Text>
          {OFFERINGS.map((booking) => (
            <View key={booking.id} style={styles.bookingRow}>
              <View>
                <Text style={styles.bookingTitle}>{booking.title}</Text>
                <Text style={styles.bookingDetail}>{booking.detail}</Text>
              </View>
              <Text style={styles.bookingPrice}>{booking.price}</Text>
            </View>
          ))}
          <Pressable style={styles.bookingButton}>
            <Text style={styles.bookingButtonText}>Request Genesis Access</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Current fix: removed the SDK path that was throwing `import.meta`
            under Expo web. Base connection now uses the browser wallet provider
            directly so localhost previewing stays viable.
          </Text>
        </View>
      </ScrollView>
      <Animated.View
        pointerEvents={loggingOut ? "auto" : "none"}
        style={[
          styles.logoutOverlay,
          {
            opacity: logoutFade
          }
        ]}
      >
        <View style={styles.logoutPanel}>
          <Text style={styles.logoutTitle}>Witching Hour Terminal</Text>
          <View style={styles.logoutLog}>
            <Text style={styles.logoutLine}>$ exit --house</Text>
            <Text style={styles.logoutLine}>Disconnecting rooms...</Text>
            <Text style={styles.logoutLine}>Saving ambient state...</Text>
            <Text style={styles.logoutLine}>Door sealed. You remain.</Text>
          </View>
          <Pressable style={styles.reenterButton} onPress={handleReenter}>
            <Text style={styles.reenterButtonText}>Return Inside</Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.ink
  },
  container: {
    padding: 24,
    gap: 24
  },
  hero: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: THEME.void,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 18
  },
  brandMark: {
    color: THEME.white,
    fontSize: 18,
    letterSpacing: 6,
    fontWeight: "700"
  },
  navRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10
  },
  navItem: {
    color: THEME.mist,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 10
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 3,
    color: THEME.mist,
    fontSize: 12,
    marginBottom: 8
  },
  title: {
    fontSize: 34,
    color: THEME.white,
    fontWeight: "600"
  },
  subtitle: {
    marginTop: 12,
    color: THEME.ash,
    lineHeight: 22,
    fontSize: 15
  },
  manifesto: {
    marginTop: 14,
    color: THEME.mist,
    lineHeight: 22
  },
  heroActions: {
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  primaryHeroButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: THEME.white
  },
  primaryHeroButtonText: {
    color: THEME.ink,
    fontWeight: "700"
  },
  secondaryHeroButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(180,79,255,0.12)"
  },
  secondaryHeroButtonText: {
    color: THEME.white,
    fontWeight: "700"
  },
  heroFooter: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    gap: 4
  },
  heroFooterLabel: {
    color: THEME.mist,
    textTransform: "uppercase",
    fontSize: 10,
    letterSpacing: 2
  },
  heroFooterValue: {
    color: THEME.greenGlow,
    fontSize: 13
  },
  roomStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  roomChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b2b35",
    backgroundColor: THEME.smoke
  },
  roomChipActive: {
    borderColor: THEME.magenta,
    backgroundColor: "rgba(180,79,255,0.12)"
  },
  roomChipText: {
    color: THEME.ash,
    fontSize: 13
  },
  roomChipTextActive: {
    color: THEME.white
  },
  sceneFrame: {
    height: 240,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#0a0a10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  sceneRoom: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden"
  },
  sceneBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#14141f"
  },
  sceneWallLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "32%",
    backgroundColor: "#124734",
    opacity: 0.9,
    zIndex: 1
  },
  sceneWallRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "32%",
    backgroundColor: "#4d246b",
    opacity: 0.85,
    zIndex: 1
  },
  sceneWallBack: {
    position: "absolute",
    left: "20%",
    right: "20%",
    top: "16%",
    bottom: "16%",
    backgroundColor: "#241a3e",
    borderWidth: 1,
    borderColor: "#3a3a4a",
    opacity: 0.9,
    zIndex: 2
  },
  sceneWindow: {
    position: "absolute",
    left: "38%",
    right: "38%",
    top: "18%",
    height: "24%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.goldGlow,
    backgroundColor: "rgba(230, 201, 122, 0.18)",
    zIndex: 3
  },
  sceneFloor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -40,
    height: "45%",
    backgroundColor: "#0a0a10",
    opacity: 0.95,
    transform: [{ skewX: "-8deg" }],
    zIndex: 0
  },
  sceneGlow: {
    position: "absolute",
    left: "25%",
    right: "25%",
    top: "10%",
    bottom: "10%",
    backgroundColor: THEME.magenta,
    opacity: 0.18,
    borderRadius: 999,
    zIndex: 4
  },
  sceneContent: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    zIndex: 5
  },
  roomTitle: {
    fontSize: 22,
    color: THEME.white,
    marginBottom: 8
  },
  roomDesc: {
    color: THEME.ash,
    lineHeight: 20
  },
  roomMood: {
    color: THEME.mist,
    marginTop: 6,
    fontSize: 12
  },
  roomActions: {
    marginTop: 12
  },
  roomHint: {
    color: THEME.mist,
    fontSize: 12
  },
  exitButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b2b35",
    backgroundColor: "#0d0d14",
    alignSelf: "flex-start"
  },
  exitButtonText: {
    color: THEME.ash,
    fontSize: 12,
    letterSpacing: 1
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 20,
    color: THEME.white
  },
  sectionCopy: {
    color: THEME.ash,
    lineHeight: 20
  },
  baseCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(122,74,168,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,255,198,0.16)",
    gap: 14
  },
  baseMeta: {
    gap: 6
  },
  tokenRow: {
    gap: 4
  },
  baseLabel: {
    color: THEME.greenGlow,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontSize: 11
  },
  baseStatus: {
    color: THEME.white,
    fontSize: 17,
    fontWeight: "600"
  },
  baseHint: {
    color: THEME.ash,
    lineHeight: 20,
    fontSize: 13
  },
  baseError: {
    color: "#ffb1b1",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10
  },
  baseButton: {
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: THEME.greenGlow,
    alignItems: "center"
  },
  baseButtonDisabled: {
    opacity: 0.7
  },
  baseButtonText: {
    color: THEME.ink,
    fontWeight: "700",
    letterSpacing: 0.3
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  productCard: {
    flexBasis: "48%",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  productCategory: {
    color: THEME.mist,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 10,
    marginBottom: 10
  },
  productTitle: {
    color: THEME.white,
    fontSize: 15
  },
  productPrice: {
    color: THEME.greenGlow,
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700"
  },
  productNote: {
    color: THEME.ash,
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18
  },
  productButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  productButtonText: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: "600"
  },
  playerCard: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16
  },
  playerMeta: {
    flex: 1
  },
  playerTitle: {
    color: THEME.white,
    fontSize: 16
  },
  playerArtist: {
    color: THEME.mist,
    marginTop: 4
  },
  playerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: THEME.goldGlow,
    borderRadius: 999
  },
  playerButtonText: {
    color: THEME.ink,
    fontWeight: "600"
  },
  playerNote: {
    color: THEME.mist,
    fontSize: 12
  },
  accessRow: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  accessTitle: {
    color: THEME.white,
    fontSize: 15
  },
  accessMeta: {
    color: THEME.mist,
    marginTop: 4
  },
  accessStatus: {
    color: THEME.goldGlow,
    fontWeight: "600"
  },
  bookingRow: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bookingTitle: {
    color: THEME.white,
    fontSize: 15
  },
  bookingDetail: {
    color: THEME.mist,
    marginTop: 4,
    fontSize: 12
  },
  bookingPrice: {
    color: THEME.greenGlow,
    fontWeight: "600"
  },
  bookingButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: THEME.magenta,
    alignItems: "center"
  },
  bookingButtonText: {
    color: THEME.white,
    fontWeight: "600"
  },
  footer: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  footerText: {
    color: THEME.mist,
    fontSize: 12,
    lineHeight: 18
  },
  logoutOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(3, 3, 6, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  logoutPanel: {
    width: "100%",
    maxWidth: 520,
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2b2b3a",
    backgroundColor: "#0a0a12"
  },
  logoutTitle: {
    color: THEME.white,
    fontSize: 16,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16
  },
  logoutLog: {
    gap: 8,
    marginBottom: 18
  },
  logoutLine: {
    color: THEME.mist,
    fontSize: 12,
    letterSpacing: 1
  },
  reenterButton: {
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: THEME.ember,
    alignItems: "center"
  },
  reenterButtonText: {
    color: THEME.white,
    fontWeight: "600"
  }
});
