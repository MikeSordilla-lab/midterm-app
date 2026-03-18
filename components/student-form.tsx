import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface StudentFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    firstname: string,
    lastname: string,
    ratings: number,
  ) => Promise<void>;
  initialData?: {
    firstname: string;
    lastname: string;
    ratings: number;
  };
  isEditing?: boolean;
  isLoading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false,
}) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [ratings, setRatings] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFirstname(initialData.firstname);
      setLastname(initialData.lastname);
      setRatings(initialData.ratings.toString());
    } else {
      resetForm();
    }
  }, [initialData, visible]);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setRatings("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    const ratingNum = parseInt(ratings);
    if (!ratings.trim()) {
      newErrors.ratings = "Rating is required";
    } else if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 20000) {
      newErrors.ratings = "Rating must be between 0 and 20000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(firstname, lastname, parseInt(ratings));
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save student");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            {isEditing ? "✏️ Edit Student" : "➕ Add New Student"}
          </ThemedText>
        </ThemedView>

        <ScrollView style={styles.formContainer}>
          <ThemedView style={styles.form}>
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>First Name</ThemedText>
              <TextInput
                style={[styles.input, errors.firstname && styles.inputError]}
                placeholder="Enter first name"
                value={firstname}
                onChangeText={setFirstname}
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              {errors.firstname && (
                <ThemedText style={styles.errorText}>
                  {errors.firstname}
                </ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Last Name</ThemedText>
              <TextInput
                style={[styles.input, errors.lastname && styles.inputError]}
                placeholder="Enter last name"
                value={lastname}
                onChangeText={setLastname}
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              {errors.lastname && (
                <ThemedText style={styles.errorText}>
                  {errors.lastname}
                </ThemedText>
              )}
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Rating (0-20000)</ThemedText>
              <TextInput
                style={[styles.input, errors.ratings && styles.inputError]}
                placeholder="Enter rating"
                value={ratings}
                onChangeText={setRatings}
                keyboardType="number-pad"
                placeholderTextColor="#999"
                editable={!isLoading}
              />
              {errors.ratings && (
                <ThemedText style={styles.errorText}>
                  {errors.ratings}
                </ThemedText>
              )}
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.submitButtonText}>
                  {isEditing ? "Update Student" : "Add Student"}
                </ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                isLoading && styles.cancelButtonDisabled,
              ]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#667eea",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: "#6c757d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "600",
  },
});
