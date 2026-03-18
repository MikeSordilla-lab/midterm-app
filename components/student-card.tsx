import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Student } from "@/services/api";

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
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedText type="defaultSemiBold" style={styles.studentName}>
          {student.firstname} {student.lastname}
        </ThemedText>
        <ThemedText style={styles.studentId}>#ID: {student.id}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Rating:</ThemedText>
          <ThemedText style={styles.value}>{student.ratings}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoRow}>
          <ThemedText style={styles.label}>Updated:</ThemedText>
          <ThemedText style={styles.value}>
            {formatDate(student.last_update)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit(student)}
        >
          <ThemedText style={styles.buttonText}>✏️ Edit</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.deleteButton,
            isDeleting && styles.buttonDisabled,
          ]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.buttonText}>🗑️ Delete</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  cardHeader: {
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  studentId: {
    fontSize: 12,
    opacity: 0.6,
  },
  cardContent: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#28a745",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
