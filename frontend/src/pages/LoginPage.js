import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLocale, useTypography } from "../context/LocaleContext";
import { colors } from "../styles/colors";
import { radius } from "../styles/spacing";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const { locale, t } = useLocale();
  const typography = useTypography();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titleFontFamily = typography.brandFont;
  const subtitleStyle = typography.uiRegular ? { fontFamily: typography.uiRegular } : null;
  const bodyBoldStyle = typography.uiBold ? { fontFamily: typography.uiBold } : null;

  const handleGoogleLogin = async (credential) => {
    setError("");
    setSaving(true);

    try {
      await loginWithGoogle(credential);
    } catch (e) {
      setError(e.message || t("login.googleErrorGeneric"));
    } finally {
      setSaving(false);
    }
  };

  const googleUiLocale = locale === "he" ? "he" : "en";

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.decorativeCircleTop} />
      <View style={styles.decorativeCircleBottom} />

      <View style={styles.card}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>M</Text>
        </View>

        <Text style={[styles.title, titleFontFamily ? { fontFamily: titleFontFamily } : null]}>
          {t("login.title")}
        </Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{t("login.subtitle")}</Text>

        {error ? (
          <Text style={[styles.error, subtitleStyle]}>{error}</Text>
        ) : null}

        <View style={[styles.googleButtonWrap, saving && styles.disabled]}>
          {saving ? (
            <View style={styles.googleButtonLoading}>
              <ActivityIndicator color={colors.diary.ink} size="small" />
              <Text style={[styles.googleButtonText, bodyBoldStyle]}>{t("login.signingIn")}</Text>
            </View>
          ) : (
            <GoogleLogin
              onSuccess={(response) => handleGoogleLogin(response.credential)}
              onError={() => setError(t("login.googleCancelled"))}
              text="continue_with"
              locale={googleUiLocale}
              shape="pill"
              size="large"
              theme="outline"
              width="320"
            />
          )}
        </View>

        <Text style={[styles.footerText, subtitleStyle]}>{t("login.footer")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: colors.diary.canvas,
    flexGrow: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 20,
  },
  decorativeCircleTop: {
    backgroundColor: "rgba(184, 120, 10, 0.12)",
    borderRadius: 160,
    height: 320,
    position: "absolute",
    right: -96,
    top: -104,
    width: 320,
  },
  decorativeCircleBottom: {
    backgroundColor: "rgba(232, 160, 144, 0.18)",
    borderRadius: 140,
    bottom: -88,
    height: 280,
    left: -92,
    position: "absolute",
    width: 280,
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.xl,
    borderWidth: 1,
    maxWidth: 460,
    paddingHorizontal: 28,
    paddingVertical: 30,
    shadowColor: colors.diary.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    width: "100%",
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.diary.accentLight,
    borderColor: colors.diary.divider,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginBottom: 16,
    width: 54,
  },
  brandMarkText: {
    color: colors.diary.accent,
    fontSize: 23,
    fontWeight: "900",
  },
  title: {
    color: colors.diary.ink,
    fontSize: 44,
    lineHeight: 50,
    textAlign: "center",
  },
  subtitle: {
    color: colors.diary.inkMid,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
    maxWidth: 340,
    textAlign: "center",
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
    textAlign: "center",
  },
  googleButtonWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    minHeight: 50,
    width: "100%",
  },
  googleButtonLoading: {
    alignItems: "center",
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.ink,
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: "100%",
  },
  disabled: {
    opacity: 0.62,
  },
  googleButtonText: {
    color: colors.diary.ink,
    fontSize: 14,
    fontWeight: "900",
  },
  footerText: {
    color: colors.diary.inkLight,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
    textAlign: "center",
  },
});
