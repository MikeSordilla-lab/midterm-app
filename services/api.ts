// API Service for Student Management
import { getBaseURL } from './config';

export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  ratings: number;
  last_update: string;
}

export interface ApiResponse {
  status: string;
  message?: string;
  data?: Student[];
  count?: number;
  id?: number;
}

// Get dynamically configured base URL
const BASE_URL = getBaseURL();

export const getAPIBaseURL = () => BASE_URL;

// Get all students
export const getStudents = async (): Promise<Student[]> => {
  try {
    console.log('Fetching students from:', `${BASE_URL}/students.php`);

    const response = await fetch(`${BASE_URL}/students.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log('Students data received:', data);

    if (data.status === 'ok' && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Create a new student
export const createStudent = async (
  firstname: string,
  lastname: string,
  ratings: number
): Promise<ApiResponse> => {
  try {
    console.log('Creating student:', { firstname, lastname, ratings });

    // Use URL-encoded form instead of FormData for better React Native compatibility
    const params = new URLSearchParams();
    params.append('firstname', firstname);
    params.append('lastname', lastname);
    params.append('ratings', ratings.toString());

    const response = await fetch(`${BASE_URL}/create_student.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('Create response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

// Update a student
export const updateStudent = async (
  id: number,
  firstname: string,
  lastname: string,
  ratings: number
): Promise<ApiResponse> => {
  try {
    console.log('Updating student:', { id, firstname, lastname, ratings });

    // Use URL-encoded form instead of FormData for better React Native compatibility
    const params = new URLSearchParams();
    params.append('id', id.toString());
    params.append('firstname', firstname);
    params.append('lastname', lastname);
    params.append('ratings', ratings.toString());

    const response = await fetch(`${BASE_URL}/update_student.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id: number): Promise<ApiResponse> => {
  try {
    console.log('Deleting student:', id);

    // Use URL-encoded form instead of FormData for better React Native compatibility
    const params = new URLSearchParams();
    params.append('id', id.toString());

    const deleteUrl = `${BASE_URL}/delete_student.php`;
    console.log('Delete URL:', deleteUrl);
    console.log('Delete params:', params.toString());

    const response = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('Delete response status:', response.status);
    console.log('Delete response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Delete error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
    }

    const data: ApiResponse = await response.json();
    console.log('Delete response data:', data);
    return data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
