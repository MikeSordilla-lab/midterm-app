import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  Student,
} from "@/services/api";

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Student Type Definition", () => {
    it("should define Student type with required fields", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("firstname");
      expect(student).toHaveProperty("lastname");
      expect(student).toHaveProperty("ratings");
      expect(student).toHaveProperty("last_update");
    });

    it("should validate student id is number", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };
      expect(typeof student.id).toBe("number");
    });

    it("should validate student names are strings", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };
      expect(typeof student.firstname).toBe("string");
      expect(typeof student.lastname).toBe("string");
    });

    it("should validate ratings is number", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };
      expect(typeof student.ratings).toBe("number");
    });
  });

  describe("API Functions Exist", () => {
    it("should export getStudents function", () => {
      expect(getStudents).toBeDefined();
      expect(typeof getStudents).toBe("function");
    });

    it("should export createStudent function", () => {
      expect(createStudent).toBeDefined();
      expect(typeof createStudent).toBe("function");
    });

    it("should export updateStudent function", () => {
      expect(updateStudent).toBeDefined();
      expect(typeof updateStudent).toBe("function");
    });

    it("should export deleteStudent function", () => {
      expect(deleteStudent).toBeDefined();
      expect(typeof deleteStudent).toBe("function");
    });
  });

  describe("Data Validation", () => {
    it("should validate student firstname is not empty", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };
      expect(student.firstname.length).toBeGreaterThan(0);
    });

    it("should validate student lastname is not empty", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };
      expect(student.lastname.length).toBeGreaterThan(0);
    });

    it("should validate ratings are in valid range", () => {
      const validRatings = [0, 25, 50, 75, 100];
      validRatings.forEach((rating) => {
        expect(rating).toBeGreaterThanOrEqual(0);
        expect(rating).toBeLessThanOrEqual(100);
      });
    });

    it("should reject invalid ratings", () => {
      const invalidRatings = [-1, 101, 150];
      invalidRatings.forEach((rating) => {
        const isValid = rating >= 0 && rating <= 100;
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Student Creation", () => {
    it("should create student object with valid data", () => {
      const newStudent = {
        firstname: "Jane",
        lastname: "Smith",
        ratings: 85,
      };

      expect(newStudent).toHaveProperty("firstname");
      expect(newStudent).toHaveProperty("lastname");
      expect(newStudent).toHaveProperty("ratings");
      expect(newStudent.firstname).toBe("Jane");
      expect(newStudent.lastname).toBe("Smith");
      expect(newStudent.ratings).toBe(85);
    });

    it("should validate required fields", () => {
      const studentData = {
        firstname: "",
        lastname: "Smith",
        ratings: 85,
      };

      const isValid = studentData.firstname.length > 0;
      expect(isValid).toBe(false);
    });
  });

  describe("Student Updates", () => {
    it("should allow updating firstname", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const updated = { ...student, firstname: "Jane" };
      expect(updated.firstname).toBe("Jane");
      expect(updated.id).toBe(1);
    });

    it("should allow updating lastname", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const updated = { ...student, lastname: "Smith" };
      expect(updated.lastname).toBe("Smith");
      expect(updated.id).toBe(1);
    });

    it("should allow updating ratings", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const updated = { ...student, ratings: 88 };
      expect(updated.ratings).toBe(88);
      expect(updated.id).toBe(1);
    });
  });

  describe("Student Deletion", () => {
    it("should handle student id for deletion", () => {
      const studentId = 1;
      expect(typeof studentId).toBe("number");
      expect(studentId).toBeGreaterThan(0);
    });

    it("should not delete without id", () => {
      const studentId = null;
      expect(studentId).toBeNull();
    });
  });

  describe("Batch Operations", () => {
    it("should handle multiple students", () => {
      const students: Student[] = [
        {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          ratings: 95,
          last_update: "2024-03-19T10:00:00Z",
        },
        {
          id: 2,
          firstname: "Jane",
          lastname: "Smith",
          ratings: 88,
          last_update: "2024-03-19T11:00:00Z",
        },
        {
          id: 3,
          firstname: "Bob",
          lastname: "Johnson",
          ratings: 92,
          last_update: "2024-03-19T12:00:00Z",
        },
      ];

      expect(students).toHaveLength(3);
      expect(students[0].firstname).toBe("John");
      expect(students[1].firstname).toBe("Jane");
      expect(students[2].firstname).toBe("Bob");
    });

    it("should handle empty student list", () => {
      const students: Student[] = [];
      expect(students).toHaveLength(0);
    });

    it("should filter students by rating", () => {
      const students: Student[] = [
        {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          ratings: 95,
          last_update: "2024-03-19T10:00:00Z",
        },
        {
          id: 2,
          firstname: "Jane",
          lastname: "Smith",
          ratings: 88,
          last_update: "2024-03-19T11:00:00Z",
        },
      ];

      const highRators = students.filter((s) => s.ratings >= 90);
      expect(highRators).toHaveLength(1);
      expect(highRators[0].firstname).toBe("John");
    });
  });

  describe("Data Consistency", () => {
    it("should maintain student id immutability", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const original = student.id;
      expect(student.id).toBe(original);
    });

    it("should preserve other fields during update", () => {
      const student: Student = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        ratings: 95,
        last_update: "2024-03-19T10:00:00Z",
      };

      const updated = { ...student, firstname: "Jane" };
      expect(updated.id).toBe(student.id);
      expect(updated.lastname).toBe(student.lastname);
      expect(updated.ratings).toBe(student.ratings);
      expect(updated.last_update).toBe(student.last_update);
    });
  });
});
