import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocale, useTypography } from "../../context/LocaleContext";
import { messagesByLocale } from "../../i18n";
import { colors } from "../../styles/colors";
import { radius, shadow } from "../../styles/spacing";

function getLocalDateKey(dateValue = new Date()) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthCells(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      dateKey: getLocalDateKey(date),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function CalendarSidePanel({
  selectedDate,
  onSelectDate,
  titleFontFamily,
  variant = "default",
}) {
  const { locale, t } = useLocale();
  const typography = useTypography();
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${selectedDate}T00:00:00`));

  const loc = locale === "he" ? "he-IL" : "en-US";
  const monthTitle = visibleMonth.toLocaleDateString(loc, {
    month: "long",
    year: "numeric",
  });

  const calendarCells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);
  const weekdays =
    messagesByLocale[locale]?.calendar?.weekdaysShort ||
    messagesByLocale.en.calendar.weekdaysShort;

  const labelStyle = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const weekdayStyle = typography.uiBold ? { fontFamily: typography.uiBold } : null;
  const monthBtnStyle = typography.uiBold ? { fontFamily: typography.uiBold } : null;

  const moveMonth = (amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const isJournal = variant === "journal";

  return (
    <View style={[styles.card, isJournal && styles.cardJournal]}>
      <Text style={[styles.label, labelStyle, isJournal && styles.labelJournal]}>{t("calendar.chooseDate")}</Text>

      <View style={styles.monthHeader}>
        <TouchableOpacity
          style={[styles.monthButton, isJournal && styles.monthButtonJournal]}
          onPress={() => moveMonth(-1)}
        >
          <Text style={[styles.monthButtonText, monthBtnStyle]}>{"<"}</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.monthTitle,
            isJournal && styles.monthTitleJournal,
            titleFontFamily ? { fontFamily: titleFontFamily } : null,
          ]}
        >
          {monthTitle}
        </Text>

        <TouchableOpacity
          style={[styles.monthButton, isJournal && styles.monthButtonJournal]}
          onPress={() => moveMonth(1)}
        >
          <Text style={[styles.monthButtonText, monthBtnStyle]}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {weekdays.map((label) => (
          <Text key={label} style={[styles.weekdayLabel, weekdayStyle, isJournal && styles.weekdayLabelJournal]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {calendarCells.map((cell, index) => {
          const isSelected = cell?.dateKey === selectedDate;
          const isToday = cell?.dateKey === todayKey;

          return (
            <TouchableOpacity
              key={cell?.dateKey || `empty-${index}`}
              style={[
                styles.dayCell,
                isJournal && styles.dayCellJournal,
                !cell && styles.emptyCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
              ]}
              disabled={!cell}
              onPress={() => cell && onSelectDate(cell.dateKey)}
              activeOpacity={0.75}
            >
              {cell ? (
                <Text
                  style={[
                    styles.dayText,
                    isJournal && styles.dayTextJournal,
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
                    weekdayStyle,
                  ]}
                >
                  {cell.day}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.diary.paper,
    borderColor: colors.diary.accentLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 14,
    width: 292,
    ...shadow.md,
  },
  cardJournal: {
    alignSelf: "center",
    maxWidth: 420,
    padding: 20,
    width: "100%",
    ...shadow.md,
  },
  label: {
    color: colors.diary.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  labelJournal: {
    fontSize: 13,
    marginBottom: 12,
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  monthButtonJournal: {
    height: 36,
    width: 36,
  },
  monthButtonText: {
    color: colors.diary.inkMid,
    fontSize: 15,
    fontWeight: "800",
  },
  monthTitle: {
    color: colors.diary.ink,
    fontSize: 22,
    textAlign: "center",
  },
  monthTitleJournal: {
    fontSize: 26,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekdayLabel: {
    color: colors.diary.inkLight,
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  weekdayLabelJournal: {
    fontSize: 11,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    borderRadius: radius.full,
    justifyContent: "center",
    marginVertical: 2,
    width: "14.285%",
  },
  dayCellJournal: {
    marginVertical: 3,
  },
  emptyCell: {
    opacity: 0,
  },
  todayCell: {
    backgroundColor: colors.diary.accentLight,
  },
  selectedCell: {
    backgroundColor: colors.diary.accent,
  },
  dayText: {
    color: colors.diary.inkMid,
    fontSize: 13,
    fontWeight: "700",
  },
  dayTextJournal: {
    fontSize: 16,
  },
  todayText: {
    color: colors.diary.ink,
  },
  selectedText: {
    color: colors.diary.paper,
  },
});
