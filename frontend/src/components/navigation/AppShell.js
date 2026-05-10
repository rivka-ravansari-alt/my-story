import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useFonts, Caveat_700Bold } from "@expo-google-fonts/caveat";
import { colors } from "../../styles/colors";
import { radius } from "../../styles/spacing";

const SIDEBAR_WIDTH = 244;
const COLLAPSED_WIDTH = 76;
const MOBILE_BREAKPOINT = 720;

const NAV_ITEMS = [
  {
    label: "Calendar",
    routeName: "CalendarJournalPage",
    icon: "calendar",
    matchRoutes: ["CalendarJournalPage"],
  },
  {
    label: "Stories",
    routeName: "EventsPage",
    icon: "stories",
    matchRoutes: ["EventsPage", "WritingPage"],
  },
  {
    label: "Tags",
    routeName: "TagsPage",
    icon: "tags",
    matchRoutes: ["TagsPage"],
  },
];

function NavigationIcon({ active, type }) {
  if (type === "calendar") {
    return (
      <View style={[styles.calendarIcon, active && styles.navGlyphBorderActive]}>
        <View style={[styles.calendarIconTop, active && styles.navGlyphActive]} />
        <View style={styles.calendarIconGrid}>
          <View style={[styles.calendarIconDot, active && styles.navGlyphActive]} />
          <View style={[styles.calendarIconDot, active && styles.navGlyphActive]} />
          <View style={[styles.calendarIconDot, active && styles.navGlyphActive]} />
          <View style={[styles.calendarIconDot, active && styles.navGlyphActive]} />
        </View>
      </View>
    );
  }

  if (type === "stories") {
    return (
      <View style={[styles.storyIcon, active && styles.navGlyphBorderActive]}>
        <View style={[styles.storyIconLine, active && styles.navGlyphActive]} />
        <View style={[styles.storyIconLine, styles.storyIconLineShort, active && styles.navGlyphActive]} />
        <View style={[styles.storyIconLine, active && styles.navGlyphActive]} />
      </View>
    );
  }

  return (
    <View style={[styles.tagIcon, active && styles.navGlyphBorderActive]}>
      <View style={[styles.tagIconDot, active && styles.tagIconDotActive]} />
      <View style={[styles.tagIconLine, active && styles.navGlyphActive]} />
    </View>
  );
}

function SidebarContent({
  activeRouteName,
  collapsed,
  onCloseDrawer,
  onNavigate,
  onToggleCollapsed,
  showCollapseControl,
  titleFontFamily,
}) {
  const showLabels = !collapsed;

  return (
    <View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>M</Text>
        </View>
        {showLabels ? (
          <View style={styles.brandTextWrap}>
            <Text style={[styles.brandTitle, titleFontFamily ? { fontFamily: titleFontFamily } : null]}>
              My Story
            </Text>
            <Text style={styles.brandSubtitle}>Memory journal</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.navList}>
        {NAV_ITEMS.map((item) => {
          const active = item.matchRoutes.includes(activeRouteName);
          return (
            <TouchableOpacity
              key={item.routeName}
              activeOpacity={0.84}
              onPress={() => onNavigate(item.routeName)}
              style={[
                styles.navItem,
                collapsed && styles.navItemCollapsed,
                active && styles.navItemActive,
              ]}
            >
              <View style={[styles.navIcon, active && styles.navIconActive]}>
                <NavigationIcon active={active} type={item.icon} />
              </View>
              {showLabels ? (
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                  {item.label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sidebarFooter}>
        {showCollapseControl ? (
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={onToggleCollapsed}
            style={[styles.utilityButton, collapsed && styles.utilityButtonCollapsed]}
          >
            <View style={styles.utilityBadge}>
              <Text style={styles.utilityBadgeText}>{collapsed ? ">" : "<"}</Text>
            </View>
            {showLabels ? (
              <Text style={styles.utilityTitle}>
                {collapsed ? "Open sidebar" : "Collapse sidebar"}
              </Text>
            ) : null}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.84} onPress={onCloseDrawer} style={styles.mobileClose}>
            <Text style={styles.mobileCloseText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function AppShell({ activeRouteName, children, navigation }) {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  const [fontsLoaded] = useFonts({ Caveat_700Bold });
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const animatedSidebarWidth = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  const effectiveCollapsed = !isMobile && collapsed;
  const sidebarWidth = effectiveCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const titleFontFamily = fontsLoaded ? "Caveat_700Bold" : undefined;

  useEffect(() => {
    Animated.timing(animatedSidebarWidth, {
      duration: 220,
      toValue: sidebarWidth,
      useNativeDriver: false,
    }).start();
  }, [animatedSidebarWidth, sidebarWidth]);

  const shellStyle = [
    styles.desktopShell,
    {
      width: animatedSidebarWidth,
    },
  ];

  const navigateTo = (routeName) => {
    setDrawerOpen(false);
    navigation.navigate(routeName);
  };

  const toggleCollapsed = () => {
    setCollapsed((current) => !current);
  };

  return (
    <View style={styles.appFrame}>
      {!isMobile ? (
        <Animated.View style={shellStyle}>
          <SidebarContent
            activeRouteName={activeRouteName}
            collapsed={effectiveCollapsed}
            onNavigate={navigateTo}
            onToggleCollapsed={toggleCollapsed}
            showCollapseControl
            titleFontFamily={titleFontFamily}
          />
        </Animated.View>
      ) : null}

      <View style={styles.contentFrame}>
        {isMobile ? (
          <View style={styles.mobileHeader}>
            <TouchableOpacity
              accessibilityLabel="Open navigation menu"
              activeOpacity={0.84}
              onPress={() => setDrawerOpen(true)}
              style={styles.mobileMenuButton}
            >
              <Text style={styles.mobileMenuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={[styles.mobileTitle, titleFontFamily ? { fontFamily: titleFontFamily } : null]}>
              My Story
            </Text>
            <View style={styles.mobileHeaderSpacer} />
          </View>
        ) : null}
        {children}
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isMobile && drawerOpen}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerLayer}>
          <Pressable style={styles.drawerBackdrop} onPress={() => setDrawerOpen(false)} />
          <View style={styles.drawerPanel}>
            <SidebarContent
              activeRouteName={activeRouteName}
              collapsed={false}
              onCloseDrawer={() => setDrawerOpen(false)}
              onNavigate={navigateTo}
              showCollapseControl={false}
              titleFontFamily={titleFontFamily}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  appFrame: {
    backgroundColor: colors.diary.canvas,
    flex: 1,
    flexDirection: "row",
  },
  desktopShell: {
    backgroundColor: colors.diary.paper,
    borderRightColor: colors.diary.divider,
    borderRightWidth: 1,
    overflow: "hidden",
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sidebar: {
    backgroundColor: colors.diary.paper,
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 50 : 28,
    paddingBottom: 18,
  },
  sidebarCollapsed: {
    paddingHorizontal: 10,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.diary.accentLight,
    borderColor: colors.diary.divider,
    borderWidth: 1,
    borderRadius: radius.lg,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  brandMarkText: {
    color: colors.diary.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    color: colors.diary.ink,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    color: colors.diary.inkLight,
    fontSize: 11,
    marginTop: 2,
  },
  navList: {
    gap: 8,
    marginTop: 28,
  },
  navItem: {
    alignItems: "center",
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  navItemActive: {
    backgroundColor: colors.diary.accentLight,
    borderColor: colors.diary.divider,
  },
  navIcon: {
    alignItems: "center",
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  navIconActive: {
    backgroundColor: colors.diary.ink,
    borderColor: colors.diary.ink,
  },
  navLabel: {
    color: colors.diary.inkMid,
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  navLabelActive: {
    color: colors.diary.ink,
  },
  calendarIcon: {
    borderColor: colors.diary.inkMid,
    borderRadius: 3,
    borderWidth: 1.5,
    height: 18,
    overflow: "hidden",
    width: 18,
  },
  calendarIconTop: {
    backgroundColor: colors.diary.inkMid,
    height: 4,
    width: "100%",
  },
  calendarIconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    padding: 3,
  },
  calendarIconDot: {
    backgroundColor: colors.diary.inkMid,
    borderRadius: 2,
    height: 3,
    width: 3,
  },
  storyIcon: {
    borderColor: colors.diary.inkMid,
    borderRadius: 3,
    borderWidth: 1.5,
    gap: 3,
    height: 18,
    justifyContent: "center",
    paddingHorizontal: 3,
    width: 16,
  },
  storyIconLine: {
    backgroundColor: colors.diary.inkMid,
    borderRadius: radius.full,
    height: 1.5,
    width: "100%",
  },
  storyIconLineShort: {
    width: "70%",
  },
  tagIcon: {
    alignItems: "center",
    borderColor: colors.diary.inkMid,
    borderRadius: 5,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 3,
    height: 15,
    paddingHorizontal: 3,
    transform: [{ rotate: "-8deg" }],
    width: 20,
  },
  tagIconDot: {
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.inkMid,
    borderRadius: 3,
    borderWidth: 1,
    height: 5,
    width: 5,
  },
  tagIconDotActive: {
    backgroundColor: colors.diary.accent,
    borderColor: colors.diary.paper,
  },
  tagIconLine: {
    backgroundColor: colors.diary.inkMid,
    borderRadius: radius.full,
    height: 2,
    width: 7,
  },
  navGlyphActive: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.paper,
  },
  navGlyphBorderActive: {
    borderColor: colors.diary.paper,
  },
  sidebarFooter: {
    gap: 8,
    marginTop: "auto",
  },
  utilityButton: {
    alignItems: "center",
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  utilityButtonCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  utilityBadge: {
    alignItems: "center",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  utilityBadgeText: {
    color: colors.diary.inkMid,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
  },
  utilityTitle: {
    color: colors.diary.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  contentFrame: {
    backgroundColor: colors.diary.canvas,
    flex: 1,
  },
  mobileHeader: {
    alignItems: "center",
    backgroundColor: colors.diary.paper,
    borderBottomColor: colors.diary.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingBottom: 10,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 50 : 18,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mobileMenuButton: {
    alignItems: "center",
    backgroundColor: colors.diary.accentLight,
    borderColor: colors.diary.divider,
    borderWidth: 1,
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  mobileMenuIcon: {
    color: colors.diary.inkMid,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26,
  },
  mobileTitle: {
    color: colors.diary.ink,
    flex: 1,
    fontSize: 22,
    lineHeight: 26,
    textAlign: "center",
  },
  mobileHeaderSpacer: {
    width: 40,
  },
  drawerLayer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(44, 26, 14, 0.36)",
  },
  drawerPanel: {
    backgroundColor: colors.diary.paper,
    maxWidth: 304,
    width: "82%",
    shadowColor: colors.diary.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 4, height: 0 },
    elevation: 6,
  },
  mobileClose: {
    alignItems: "center",
    backgroundColor: colors.diary.ink,
    borderRadius: radius.full,
    paddingVertical: 12,
  },
  mobileCloseText: {
    color: colors.diary.paper,
    fontSize: 13,
    fontWeight: "800",
  },
});
