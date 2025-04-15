// services/api.ts

const SERVER_URL = 'https://192.168.56.1:3000'; 

// Function to submit a footprint
export const submitFootprint = async (data: {
  location: string;
  photoUrl: string;
  notes: string;
  timestamp: string;
}) => {
  const response = await fetch(`${SERVER_URL}/api/footprints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Check if the response is not ok
  if (!response.ok) {
    throw new Error('Submission failed');
  }

  return await response.json();
};

// Function to fetch footprints
export const fetchFootprints = async () => {
  const res = await fetch(`${SERVER_URL}/api/footprints`);
  if (!res.ok) {
    throw new Error('Failed to load footprints');
  }
  return await res.json();
};
