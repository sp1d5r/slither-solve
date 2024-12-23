import { Challenge, TestCase } from 'shared';

interface ChallengeRepository {
  challenges: Record<string, Challenge>;
}

export const variableChallenges: Challenge[] = [
  {
    id: "var-1",
    title: "Your First Variable",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the number 5.",
    boilerplate: "# Create a variable x with value 5\n",
    examples: [{
      input: "",
      output: "x = 5"
    }],
    hints: [
      "In Python, you can assign values using the = sign",
      "No need to declare variable type in Python"
    ],
    tests: [{
      input: [],
      expected: 5
    }]
  },
  {
    id: "var-2",
    title: "String Variable",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the text 'python'.",
    boilerplate: "# Create a variable x with text 'python'\n",
    examples: [{
      input: "",
      output: "x = 'python'"
    }],
    hints: [
      "Text values need to be in quotes",
      "You can use single or double quotes for strings"
    ],
    tests: [{
      input: [],
      expected: "python"
    }]
  },
  {
    id: "var-3",
    title: "Boolean Variable",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the boolean value True.",
    boilerplate: "# Create a variable x with value True\n",
    examples: [{
      input: "",
      output: "x = True"
    }],
    hints: [
      "Boolean values in Python are True and False",
      "True and False must start with capital letters",
      "Don't put True in quotes - that would make it a string!"
    ],
    tests: [{
      input: [],
      expected: "True"
    }]
  },
  {
    id: "var-4",
    title: "Variable Reassignment",
    difficulty: "Easy",
    topic: "variables",
    description: "First create variable 'x' with value 10, then on the next line change its value to 20.",
    boilerplate: "# Create x with value 10\n# Then change x to 20\n",
    examples: [{
      input: "",
      output: "x = 10\nx = 20"
    }],
    hints: [
      "You can change a variable's value at any time",
      "The new value replaces the old one completely"
    ],
    tests: [{
      input: [],
      expected: 20
    }]
  },
  {
    id: "var-5",
    title: "Float Variable",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the decimal number 3.14",
    boilerplate: "# Create x with value 3.14\n",
    examples: [{
      input: "",
      output: "x = 3.14"
    }],
    hints: [
      "Decimal numbers use a dot (.) not a comma",
      "Don't put the number in quotes"
    ],
    tests: [{
      input: [],
      expected: 3.14
    }]
  },
  {
    id: "var-6",
    title: "Empty String",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it an empty string.",
    boilerplate: "# Create x as an empty string\n",
    examples: [{
      input: "",
      output: "x = ''"
    }],
    hints: [
      "An empty string is two quotes with nothing between them",
      "You can use either '' or \"\""
    ],
    tests: [{
      input: [],
      expected: ""
    }]
  },
  {
    id: "var-7",
    title: "String with Spaces",
    difficulty: "Easy",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the text 'Hello World'.",
    boilerplate: "# Create x with text 'Hello World'\n",
    examples: [{
      input: "",
      output: "x = 'Hello World'"
    }],
    hints: [
      "Spaces are valid inside string quotes",
      "Make sure to include exactly one space between words"
    ],
    tests: [{
      input: [],
      expected: "Hello World"
    }]
  },
  {
    id: "var-8",
    title: "Special Numbers",
    difficulty: "Medium",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the value zero.",
    boilerplate: "# Create x with value 0\n",
    examples: [{
      input: "",
      output: "x = 0"
    }],
    hints: [
      "Zero is written as 0 in Python",
      "Don't put zero in quotes"
    ],
    tests: [{
      input: [],
      expected: 0
    }]
  },
  {
    id: "var-9",
    title: "Negative Numbers",
    difficulty: "Medium",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the value negative five (-5).",
    boilerplate: "# Create x with value -5\n",
    examples: [{
      input: "",
      output: "x = -5"
    }],
    hints: [
      "Use the minus sign before the number",
      "No space needed between - and the number"
    ],
    tests: [{
      input: [],
      expected: -5
    }]
  },
  {
    id: "var-10",
    title: "Boolean False",
    difficulty: "Medium",
    topic: "variables",
    description: "Create a variable named 'x' and assign it the boolean value False.",
    boilerplate: "# Create x with value False\n",
    examples: [{
      input: "",
      output: "x = False"
    }],
    hints: [
      "False must start with a capital F",
      "Don't put False in quotes"
    ],
    tests: [{
      input: [],
      expected: "False"
    }]
  }
];


export const ifStatementChallenges: Challenge[] = [
  {
    id: "if-1",
    title: "Check Number Size",
    difficulty: "Easy",
    topic: "if_statements",
    description: "Write a function that takes a number and returns 'big' if it's greater than 10, otherwise returns 'small'.",
    boilerplate: "def check_size(number):\n    # Write your code here\n    pass",
    examples: [
      {
        input: "check_size(15)",
        output: "'big'"
      },
      {
        input: "check_size(5)",
        output: "'small'"
      }
    ],
    hints: [
      "Use if to check if number > 10",
      "Use return instead of setting a variable",
      "The function should have two possible return values"
    ],
    tests: [
      {
        input: [15],
        expected: "big"
      },
      {
        input: [5],
        expected: "small"
      }
    ]
  },
  {
    id: "if-2",
    title: "Check Zero",
    difficulty: "Easy",
    topic: "if_statements",
    description: "Write a function that takes a number and returns 'zero' if the number is 0, otherwise returns 'not zero'.",
    boilerplate: "def check_zero(number):\n    # Write your code here\n    pass",
    examples: [
      {
        input: "check_zero(0)",
        output: "'zero'"
      },
      {
        input: "check_zero(42)",
        output: "'not zero'"
      }
    ],
    hints: [
      "Use == to test for equality",
      "Remember: = is for assignment, == is for comparison",
      "The function should return one of two strings"
    ],
    tests: [
      {
        input: [0],
        expected: "zero"
      },
      {
        input: [42],
        expected: "not zero"
      }
    ]
  },
  {
    id: "if-3",
    title: "Grade Checker",
    difficulty: "Medium",
    topic: "if_statements",
    description: "Write a function that takes a score and returns: 'A' if score ≥ 90, 'B' if ≥ 80, 'C' if ≥ 70, otherwise returns 'F'.",
    boilerplate: "def get_grade(score):\n    # Write your code here\n    pass",
    examples: [
      {
        input: "get_grade(95)",
        output: "'A'"
      },
      {
        input: "get_grade(85)",
        output: "'B'"
      },
      {
        input: "get_grade(65)",
        output: "'F'"
      }
    ],
    hints: [
      "Use if, elif, and else",
      "Check grades from highest to lowest",
      "All paths should have a return statement"
    ],
    tests: [
      {
        input: [95],
        expected: "A"
      },
      {
        input: [85],
        expected: "B"
      },
      {
        input: [75],
        expected: "C"
      },
      {
        input: [65],
        expected: "F"
      }
    ]
  },
  {
    id: "if-4",
    title: "Temperature Advisor",
    difficulty: "Medium",
    topic: "if_statements",
    description: "Write a function that takes a temperature and returns: 'freezing' if temp < 0, 'cold' if < 10, 'warm' if < 25, otherwise returns 'hot'.",
    boilerplate: "def get_weather(temp):\n    # Write your code here\n    pass",
    examples: [
      {
        input: "get_weather(-5)",
        output: "'freezing'"
      },
      {
        input: "get_weather(15)",
        output: "'warm'"
      },
      {
        input: "get_weather(30)",
        output: "'hot'"
      }
    ],
    hints: [
      "Check conditions from coldest to hottest",
      "Use elif to chain conditions",
      "Remember the else case for high temperatures"
    ],
    tests: [
      {
        input: [-5],
        expected: "freezing"
      },
      {
        input: [5],
        expected: "cold"
      },
      {
        input: [20],
        expected: "warm"
      },
      {
        input: [30],
        expected: "hot"
      }
    ]
  },
  {
    id: "if-5",
    title: "Number Classifier",
    difficulty: "Hard",
    topic: "if_statements",
    description: "Write a function that classifies a number as: 'positive even', 'positive odd', 'negative even', 'negative odd', or 'zero'.",
    boilerplate: "def classify_number(num):\n    # Write your code here\n    pass",
    examples: [
      {
        input: "classify_number(4)",
        output: "'positive even'"
      },
      {
        input: "classify_number(-3)",
        output: "'negative odd'"
      },
      {
        input: "classify_number(0)",
        output: "'zero'"
      }
    ],
    hints: [
      "First check if the number is zero",
      "Then check if it's positive or negative",
      "Use % 2 == 0 to check if a number is even",
      "Nested if statements might help"
    ],
    tests: [
      {
        input: [4],
        expected: "positive even"
      },
      {
        input: [3],
        expected: "positive odd"
      },
      {
        input: [-4],
        expected: "negative even"
      },
      {
        input: [-3],
        expected: "negative odd"
      },
      {
        input: [0],
        expected: "zero"
      }
    ]
  }
];

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
      ],
      tests: [
        { input: [1, 2, 3, 4, 5], expected: 15 },
        { input: [-1, 0, 1], expected: 0 },
        { input: [10], expected: 10 },
        { input: [], expected: 0 }
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
      hints: ["Variables in Python don't need to be declared with a type"],
      tests: [
        { input: [], expected: 42 }
      ]
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
      hints: ["You can use the + operator with strings"],
      tests: [
        { input: ["Hello", "World"], expected: "Hello World" },
        { input: ["Python", "Programming"], expected: "Python Programming" }
      ]
    },
    ...Object.fromEntries(variableChallenges.map(challenge => [challenge.id, challenge])),
    ...Object.fromEntries(ifStatementChallenges.map(challenge => [challenge.id, challenge])),
  },
};

export class ChallengeService {
  async getChallenge(id: string): Promise<Challenge | null> {
    return challengeRepo.challenges[id] || null;
  }

  async getTestCases(challengeId: string): Promise<TestCase[]> {
    return challengeRepo.challenges[challengeId].tests || [];
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
