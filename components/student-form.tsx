import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { EnhancedTextInput } from "@/components/ui/text-input";
import { EnhancedButton } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Spacing,
  BorderRadius,
  Typography,
  LightTheme,
  DarkTheme,
} from "@/constants/design-tokens";

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

  const textColor = useThemeColor({}, "text");
  const isDarkMode = textColor === "#f9fafb";
  const themeColors = isDarkMode ? DarkTheme.colors : LightTheme.colors;

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
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        {/* Modal Header */}
        <View
          style={[styles.header, { borderBottomColor: themeColors.divider }]}
        >
          <ThemedText type="h2" style={styles.headerTitle}>
            {isEditing ? "✏️ Edit Student" : "➕ Add New Student"}
          </ThemedText>
        </View>

        {/* Form Content */}
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={true}
        >
          <ThemedView style={styles.form}>
            {/* First Name Input */}
            <EnhancedTextInput
              label="First Name"
              placeholder="Enter first name"
              value={firstname}
              onChangeText={setFirstname}
              error={errors.firstname}
              maxLength={50}
              editable={!isLoading}
            />

            {/* Last Name Input */}
            <EnhancedTextInput
              label="Last Name"
              placeholder="Enter last name"
              value={lastname}
              onChangeText={setLastname}
              error={errors.lastname}
              maxLength={50}
              editable={!isLoading}
            />

            {/* Rating Input */}
            <EnhancedTextInput
              label="Rating (0 - 100)"
              placeholder="Enter rating"
              value={ratings}
              onChangeText={setRatings}
              keyboardType="numeric"
              error={errors.ratings}
              helperText="Enter a number between 0 and 100"
              maxLength={5}
              editable={!isLoading}
            />

            <View style={{ height: Spacing.xl }} />

            {/* Action Buttons */}
            <EnhancedButton
              title={isEditing ? "Update Student" : "Add Student"}
              onPress={handleSubmit}
              variant="primary"
              size="md"
              fullWidth={true}
              disabled={isLoading}
              loading={isLoading}
            />

            <EnhancedButton
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              size="md"
              fullWidth={true}
              disabled={isLoading}
              style={{ marginTop: Spacing.md }}
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "700" as const,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  formContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  form: {
    width: "100%",
  },
});
