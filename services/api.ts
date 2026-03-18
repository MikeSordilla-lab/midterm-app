// API Service for Student Management
// Update the BASE_URL to match your server's IP address

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

// Auto-detect API URL based on environment
let BASE_URL = getDefaultAPIUrl();

function getDefaultAPIUrl(): string {
  // For web browser at localhost:8081, use localhost:80
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost/midterm-api/api';
  }
  
  // For other environments, you can manually set the IP
  // Example for real device: 'http://192.168.1.100/midterm-api/api'
  return 'http://localhost/midterm-api/api';
}

// Allow setting custom IP
export const setAPIBaseURL = (ip: string) => {
  BASE_URL = `http://${ip}/midterm-api/api`;
  console.log('API Base URL set to:', BASE_URL);
};

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
    
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('ratings', ratings.toString());

    const response = await fetch(`${BASE_URL}/create_student.php`, {
      method: 'POST',
      body: formData,
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
    
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('ratings', ratings.toString());

    const response = await fetch(`${BASE_URL}/update_student.php`, {
      method: 'POST',
      body: formData,
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
    
    const formData = new FormData();
    formData.append('id', id.toString());

    const response = await fetch(`${BASE_URL}/delete_student.php`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit'
    });

    console.log('Delete response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
