import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../styles/colors";
import { radius, shadow } from "../../styles/spacing";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export default function CalendarSidePanel({ selectedDate, onSelectDate, titleFontFamily }) {
  const todayKey = useMemo(() => getLocalDateKey(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${selectedDate}T00:00:00`));

  const monthTitle = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarCells = useMemo(() => getMonthCells(visibleMonth), [visibleMonth]);

  const moveMonth = (amount) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Choose date</Text>

      <View style={styles.monthHeader}>
        <TouchableOpacity style={styles.monthButton} onPress={() => moveMonth(-1)}>
          <Text style={styles.monthButtonText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={[styles.monthTitle, titleFontFamily ? { fontFamily: titleFontFamily } : null]}>
          {monthTitle}
        </Text>

        <TouchableOpacity style={styles.monthButton} onPress={() => moveMonth(1)}>
          <Text style={styles.monthButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
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
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
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
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: 16,
    width: 320,
    ...shadow.md,
  },
  label: {
    color: colors.diary.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: colors.diary.paperAlt,
    borderColor: colors.diary.divider,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  monthButtonText: {
    color: colors.diary.inkMid,
    fontSize: 17,
    fontWeight: "800",
  },
  monthTitle: {
    color: colors.diary.ink,
    fontSize: 24,
    textAlign: "center",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayLabel: {
    color: colors.diary.inkLight,
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
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
    marginVertical: 3,
    width: "14.285%",
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
    fontSize: 14,
    fontWeight: "700",
  },
  todayText: {
    color: colors.diary.ink,
  },
  selectedText: {
    color: colors.diary.paper,
  },
});
