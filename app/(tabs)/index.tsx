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
  TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StudentForm } from "@/components/student-form";
import { StudentCard } from "@/components/student-card";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  Student,
  getAPIBaseURL,
} from "@/services/api";

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

  // Load students
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading students from:", apiUrl);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Load students error:", error);
      Alert.alert(
        "Error",
        `Failed to load students from ${apiUrl}\n\nMake sure:\n1. Apache is running\n2. MySQL is running\n3. API server is accessible`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

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
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#667eea" />
          <ThemedText style={styles.loadingText}>
            Loading students...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          📚 Students
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""} found
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </ThemedView>

      {filteredStudents.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {searchText
              ? "No students found matching your search"
              : "No students yet"}
          </ThemedText>
          {!searchText && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddStudent}
            >
              <ThemedText style={styles.addButtonText}>
                ➕ Add First Student
              </ThemedText>
            </TouchableOpacity>
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
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddStudent}>
        <ThemedText style={styles.fabText}>➕</ThemedText>
      </TouchableOpacity>

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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});
