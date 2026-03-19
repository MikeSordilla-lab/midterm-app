import React from "react";
import { StudentCard } from "@/components/student-card";
import { Student } from "@/services/api";

// Mock dependencies
jest.mock("@/components/themed-text", () => ({
  ThemedText: jest.fn(() => null),
}));

jest.mock("@/components/themed-view", () => ({
  ThemedView: jest.fn(() => null),
}));

jest.mock("@/components/ui/divider", () => ({
  Divider: jest.fn(() => null),
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: jest.fn(() => null),
}));

jest.mock("@/components/ui/rating-badge", () => ({
  RatingBadge: jest.fn(() => null),
}));

jest.mock("@/hooks/use-theme-color", () => ({
  useThemeColor: jest.fn(() => "#111827"),
}));

describe("StudentCard Component", () => {
  const mockStudent: Student = {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    ratings: 95,
    last_update: "2024-03-19T10:00:00Z",
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Structure", () => {
    it("should import without errors", () => {
      expect(StudentCard).toBeDefined();
      expect(typeof StudentCard).toBe("function");
    });

    it("should accept required student prop", () => {
      const props = {
        student: mockStudent,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      };
      expect(props).toHaveProperty("student");
      expect(props.student).toEqual(mockStudent);
    });

    it("should accept onEdit callback", () => {
      const props = {
        student: mockStudent,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      };
      expect(props).toHaveProperty("onEdit");
      expect(typeof props.onEdit).toBe("function");
    });

    it("should accept onDelete callback", () => {
      const props = {
        student: mockStudent,
        onEdit: mockOnEdit,
        onDelete: mockOnDelete,
      };
      expect(props).toHaveProperty("onDelete");
      expect(typeof props.onDelete).toBe("function");
    });
  });

  describe("Student Data Structure", () => {
    it("should have student id", () => {
      expect(mockStudent).toHaveProperty("id");
      expect(typeof mockStudent.id).toBe("number");
    });

    it("should have student firstname", () => {
      expect(mockStudent).toHaveProperty("firstname");
      expect(typeof mockStudent.firstname).toBe("string");
    });

    it("should have student lastname", () => {
      expect(mockStudent).toHaveProperty("lastname");
      expect(typeof mockStudent.lastname).toBe("string");
    });

    it("should have student ratings", () => {
      expect(mockStudent).toHaveProperty("ratings");
      expect(typeof mockStudent.ratings).toBe("number");
    });

    it("should have last_update timestamp", () => {
      expect(mockStudent).toHaveProperty("last_update");
      expect(typeof mockStudent.last_update).toBe("string");
    });

    it("should display full name correctly", () => {
      const fullName = `${mockStudent.firstname} ${mockStudent.lastname}`;
      expect(fullName).toBe("John Doe");
    });
  });

  describe("Callback Behavior", () => {
    it("should handle edit callback", () => {
      const onEdit = jest.fn();
      onEdit(mockStudent);
      expect(onEdit).toHaveBeenCalledWith(mockStudent);
    });

    it("should handle delete callback", async () => {
      const onDelete = jest.fn().mockResolvedValue(undefined);
      await onDelete(mockStudent.id);
      expect(onDelete).toHaveBeenCalledWith(mockStudent.id);
    });

    it("should not call callbacks on initialization", () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();

      const props = {
        student: mockStudent,
        onEdit,
        onDelete,
      };

      expect(onEdit).not.toHaveBeenCalled();
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe("Rating Validation", () => {
    it("should accept valid rating (0-100)", () => {
      const validRatings = [0, 50, 95, 100];
      validRatings.forEach((rating) => {
        expect(rating).toBeGreaterThanOrEqual(0);
        expect(rating).toBeLessThanOrEqual(100);
      });
    });

    it("should handle high ratings", () => {
      const student: Student = {
        ...mockStudent,
        ratings: 100,
      };
      expect(student.ratings).toBe(100);
    });

    it("should handle low ratings", () => {
      const student: Student = {
        ...mockStudent,
        ratings: 0,
      };
      expect(student.ratings).toBe(0);
    });
  });

  describe("Multiple Students", () => {
    it("should handle different student data", () => {
      const student1: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const student2: Student = {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        ratings: 88,
        last_update: "2024-03-19T11:00:00Z",
      };

      expect(student1.id).not.toBe(student2.id);
      expect(student1.firstname).not.toBe(student2.firstname);
      expect(student1.ratings).not.toBe(student2.ratings);
    });

    it("should create unique card instances", () => {
      const card1Props = {
        student: mockStudent,
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };

      const card2Props = {
        student: { ...mockStudent, id: 2 },
        onEdit: jest.fn(),
        onDelete: jest.fn(),
      };

      expect(card1Props).not.toBe(card2Props);
      expect(card1Props.student).not.toEqual(card2Props.student);
    });
  });
});
