// Test data structure matching the backend API
const testProfileData = {
  profile_name: "Test Health Assistant",
  name: "Dr. Jane Smith",
  age: 35,
  gender: "female",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  language: "English",
  hobbies: ["reading", "gardening", "yoga"],
  hates: ["loud noises", "rudeness"],
  interests: ["healthcare", "nutrition", "mental wellness"],
  loved_ones: [
    {
      name: "Sarah",
      relation: "daughter",
      memories: ["first steps", "graduation"]
    }
  ],
  past_stories: [
    {
      title: "Medical School",
      description: "Graduated from Harvard Medical School",
      emotional_significance: "proud"
    }
  ],
  preferences: {
    communication_style: "empathetic",
    response_length: "detailed"
  },
  personality_traits: ["empathetic", "professional", "caring"],
  health_info: {
    specialization: "general_practice",
    years_experience: 10
  },
  emotional_baseline: "calm"
};

export { testProfileData };
