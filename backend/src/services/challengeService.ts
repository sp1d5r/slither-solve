import { Challenge, TestCase } from 'shared';

interface ChallengeRepository {
  challenges: Record<string, Challenge>;
  testCases: Record<string, TestCase[]>;
}

// In-memory repository (replace with database in production)
const challengeRepo: ChallengeRepository = {
  challenges: {
    'calculate_sum': {
      id: 'calculate_sum',
      topic: 'Basic',
      title: "Sum of Numbers",
      difficulty: "Easy",
      description: "Write a function that takes a list of numbers and returns their sum.",
      boilerplate: `def calculate_sum(numbers):
    # Your code here
    pass`,
      examples: [
        {
          input: "[1, 2, 3, 4, 5]",
          output: "15"
        },
        {
          input: "[-1, 0, 1]",
          output: "0"
        }
      ],
      hints: [
        "Remember to initialize a variable to store the sum",
        "You can use a for loop or Python's built-in sum() function"
      ]
    },
    'python-basics-1': {
      id: 'python-basics-1',
      topic: 'Python Basics',
      title: "Variables and Assignment",
      difficulty: "Easy",
      description: "Create a variable 'x' and assign it the value 42.",
      boilerplate: `# Your code here
pass`,
      examples: [
        {
          input: "",
          output: "x == 42"
        }
      ],
      hints: ["Variables in Python don't need to be declared with a type"]
    },
    'python-basics-2': {
      id: 'python-basics-2',
      topic: 'Python Basics',
      title: "String Concatenation",
      difficulty: "Easy",
      description: "Write a function that concatenates two strings with a space between them.",
      boilerplate: `def concat_strings(str1, str2):
    # Your code here
    pass`,
      examples: [
        {
          input: '"Hello", "World"',
          output: '"Hello World"'
        }
      ],
      hints: ["You can use the + operator with strings"]
    }
  },
  testCases: {
    'calculate_sum': [
      { input: [1, 2, 3, 4, 5], expected: 15 },
      { input: [-1, 0, 1], expected: 0 },
      { input: [10], expected: 10 },
      { input: [], expected: 0 }
    ],
    'python-basics-1': [
      { input: [], expected: 42 }
    ],
    'python-basics-2': [
      { input: ["Hello", "World"], expected: "Hello World" },
      { input: ["Python", "Programming"], expected: "Python Programming" }
    ]
  }
};

export class ChallengeService {
  async getChallenge(id: string): Promise<Challenge | null> {
    return challengeRepo.challenges[id] || null;
  }

  async getTestCases(challengeId: string): Promise<TestCase[]> {
    return challengeRepo.testCases[challengeId] || [];
  }

  async getChallengesByTopic(topic: string): Promise<Challenge[]> {
    return Object.values(challengeRepo.challenges).filter(
      challenge => challenge.topic.toLowerCase() === topic.toLowerCase()
    );
  }

  public async listTopics(): Promise<string[]> {
    const topics = new Set(
      Object.values(challengeRepo.challenges).map(challenge => challenge.topic)
    );
    return Array.from(topics);
  }

  public async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
    const id = challenge.title.toLowerCase().replace(/\s+/g, '-');
    const newChallenge = { ...challenge, id };
    challengeRepo.challenges[id] = newChallenge;
    challengeRepo.testCases[id] = []; // Initialize empty test cases
    return newChallenge;
  }

  public async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
    if (!challengeRepo.challenges[id]) {
      return null;
    }
    
    challengeRepo.challenges[id] = {
      ...challengeRepo.challenges[id],
      ...updates
    };
    
    return challengeRepo.challenges[id];
  }
}
