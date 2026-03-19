import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Platform,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StudentForm } from "@/components/student-form";
import { StudentCard } from "@/components/student-card";
import { EnhancedTextInput } from "@/components/ui/text-input";
import { EnhancedButton } from "@/components/ui/button";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Spacing,
  BorderRadius,
  LightTheme,
  DarkTheme,
  Shadows,
  Sizes,
} from "@/constants/design-tokens";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  Student,
  getAPIBaseURL,
} from "@/services/api";
import { runDiagnostics, logDetailedError } from "@/services/debug";

export default function HomeScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | undefined>();
  const [searchText, setSearchText] = useState("");
  const [apiUrl] = useState(getAPIBaseURL());
  const [diagnosticError, setDiagnosticError] = useState<string>("");

  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  // Load students
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setDiagnosticError("");
      console.log("📱 Loading students from:", apiUrl);
      const data = await getStudents();
      setStudents(data);
      console.log("✅ Successfully loaded", data.length, "students");
    } catch (error) {
      logDetailedError("loadStudents", error);

      // Run diagnostics on failure
      console.log("🔍 Running diagnostics due to load failure...");
      try {
        const diagnosis = await runDiagnostics();
        console.log("📊 Diagnosis Result:", diagnosis);

        let errorMessage = `Failed to load students.\n\n`;
        errorMessage += `API: ${apiUrl}\n`;
        errorMessage += `Status: ${diagnosis.api.online ? "✅ Online" : "❌ Offline"}\n`;

        if (diagnosis.errors && diagnosis.errors.length > 0) {
          errorMessage += `\n⚠️  Issues:\n${diagnosis.errors.join("\n")}\n`;
        }

        if (diagnosis.recommendations && diagnosis.recommendations.length > 0) {
          errorMessage += `\n📋 Recommendations:\n${diagnosis.recommendations.join("\n")}`;
        }

        setDiagnosticError(errorMessage);
        Alert.alert("API Connection Error", errorMessage);
      } catch (diagError) {
        Alert.alert(
          "Error",
          `Failed to load students from ${apiUrl}\n\nMake sure:\n1. Apache is running\n2. MySQL is running\n3. API server is accessible at ${apiUrl}`,
        );
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStudents().finally(() => setRefreshing(false));
  }, [loadStudents]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormVisible(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormVisible(true);
  };

  const handleFormSubmit = async (
    firstname: string,
    lastname: string,
    ratings: number,
  ) => {
    try {
      setIsSubmitting(true);
      if (editingStudent) {
        await updateStudent(editingStudent.id, firstname, lastname, ratings);
        Alert.alert("Success", "Student updated successfully");
      } else {
        await createStudent(firstname, lastname, ratings);
        Alert.alert("Success", "Student created successfully");
      }
      await loadStudents();
    } catch (error) {
      Alert.alert("Error", "Failed to save student");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      setDeletingId(student.id);
      await deleteStudent(student.id);
      Alert.alert("Success", "Student deleted successfully");
      await loadStudents();
    } catch (error) {
      Alert.alert("Error", "Failed to delete student");
      console.error(error);
    } finally {
      setDeletingId(undefined);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
      student.id.toString().includes(searchText),
  );

  if (loading) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <ThemedText
            type="body"
            style={[styles.loadingText, { color: themeColors.textSecondary }]}
          >
            Loading students...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Header Section */}
      <ThemedView
        style={[
          styles.header,
          {
            backgroundColor: themeColors.surfaceBackground,
            borderBottomColor: themeColors.divider,
          },
        ]}
      >
        <ThemedText type="h1" style={styles.title}>
          📚 Students
        </ThemedText>
        <ThemedText
          type="bodySmall"
          style={[styles.subtitle, { color: themeColors.textSecondary }]}
        >
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""} found
        </ThemedText>
      </ThemedView>

      {/* Search Bar Section */}
      <ThemedView
        style={[
          styles.searchContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <EnhancedTextInput
          placeholder="Search by name or ID..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </ThemedView>

      {/* Empty State or List */}
      {filteredStudents.length === 0 ? (
        <ThemedView
          style={[
            styles.emptyContainer,
            { backgroundColor: themeColors.background },
          ]}
        >
          <ThemedText
            type="body"
            style={[styles.emptyText, { color: themeColors.textSecondary }]}
          >
            {searchText
              ? "No students found matching your search"
              : "No students yet"}
          </ThemedText>
          {!searchText && (
            <EnhancedButton
              title="➕ Add First Student"
              onPress={handleAddStudent}
              variant="primary"
              size="md"
              style={styles.emptyStateButton}
            />
          )}
        </ThemedView>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              isDeletingId={deletingId}
            />
          )}
          contentContainerStyle={[
            styles.listContainer,
            { backgroundColor: themeColors.background },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={themeColors.primary}
            />
          }
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: themeColors.primary,
            ...Shadows.lg,
          },
        ]}
        onPress={handleAddStudent}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[styles.fabText, { color: themeColors.primaryText }]}
        >
          ➕
        </ThemedText>
      </TouchableOpacity>

      {/* Student Form Modal */}
      <StudentForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingStudent(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={
          editingStudent
            ? {
                firstname: editingStudent.firstname,
                lastname: editingStudent.lastname,
                ratings: editingStudent.ratings,
              }
            : undefined
        }
        isEditing={!!editingStudent}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: Spacing.xs,
    fontWeight: "700" as const,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },

  // List
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === "web" ? Spacing.xxl : 100,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  emptyStateButton: {
    minWidth: 200,
  },

  // Loading
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
  },

  // FAB (Floating Action Button)
  fab: {
    position: "absolute",
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: Sizes.buttonHeight.lg,
    height: Sizes.buttonHeight.lg,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  fabText: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
});
