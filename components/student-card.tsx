import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Divider } from "@/components/ui/divider";
import { Avatar } from "@/components/ui/avatar";
import { RatingBadge } from "@/components/ui/rating-badge";
import { Student } from "@/services/api";
import {
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  LightTheme,
  DarkTheme,
  Sizes,
} from "@/constants/design-tokens";
import { useThemeColor } from "@/hooks/use-theme-color";

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => Promise<void>;
  isDeletingId?: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
  isDeletingId,
}) => {
  const isDeleting = isDeletingId === student.id;
  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const handleDelete = () => {
    Alert.alert(
      "Delete Student",
      `Are you sure you want to delete ${student.firstname} ${student.lastname}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await onDelete(student);
            } catch (error) {
              Alert.alert("Error", "Failed to delete student");
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surfaceElevated,
          borderColor: themeColors.border,
        },
      ]}
    >
      {/* Card Header - Student Avatar, Name & Rating */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Avatar
            initials={`${student.firstname.charAt(0)}${student.lastname.charAt(0)}`}
            size="md"
            status="online"
          />
          <View style={styles.headerInfo}>
            <ThemedText type="h3" style={styles.studentName}>
              {student.firstname} {student.lastname}
            </ThemedText>
            <ThemedText
              type="caption"
              style={[styles.studentId, { color: themeColors.textSecondary }]}
            >
              ID: {student.id}
            </ThemedText>
          </View>
        </View>
        <RatingBadge rating={student.ratings} format="label" size="sm" />
      </View>

      <Divider margin="md" />

      {/* Card Content - Student Details */}
      <View style={styles.cardContent}>
        {/* Rating Section */}
        <View style={styles.infoRow}>
          <ThemedText
            type="label"
            style={[styles.label, { color: themeColors.textSecondary }]}
          >
            Rating
          </ThemedText>
          <ThemedText
            type="bodyLarge"
            style={[styles.value, { color: themeColors.text }]}
          >
            {student.ratings}
          </ThemedText>
        </View>

        <View style={styles.spacer} />

        {/* Last Updated Section */}
        <View style={styles.infoRow}>
          <ThemedText
            type="label"
            style={[styles.label, { color: themeColors.textSecondary }]}
          >
            Last Updated
          </ThemedText>
          <ThemedText
            type="bodySmall"
            style={[styles.value, { color: themeColors.textSecondary }]}
          >
            {formatDate(student.last_update)}
          </ThemedText>
        </View>
      </View>

      <Divider margin="md" />

      {/* Card Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.editButton,
            {
              backgroundColor: themeColors.primary,
            },
          ]}
          onPress={() => onEdit(student)}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>✏️ Edit</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.deleteButton,
            {
              backgroundColor: themeColors.error,
            },
            isDeleting && styles.buttonDisabled,
          ]}
          onPress={handleDelete}
          disabled={isDeleting}
          activeOpacity={0.7}
        >
          {isDeleting ? (
            <ActivityIndicator color={themeColors.primaryText} size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>🗑️ Delete</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    // Shadow
    ...Shadows.md,
  },

  // Header Section
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    marginBottom: Spacing.xs,
    fontWeight: "700" as const,
  },
  studentId: {
    fontSize: Typography.caption.fontSize,
  },

  // Content Section
  cardContent: {
    paddingVertical: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spacer: {
    height: Spacing.md,
  },
  label: {
    fontSize: Typography.label.fontSize,
    fontWeight: "500" as const,
  },
  value: {
    fontWeight: "500" as const,
  },

  // Actions Section
  cardActions: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  button: {
    flex: 1,
    height: Platform.OS === "web" ? 40 : Sizes.buttonHeight.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  editButton: {},
  deleteButton: {},
  buttonText: {
    fontWeight: "600" as const,
    fontSize: Typography.buttonText.fontSize,
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
