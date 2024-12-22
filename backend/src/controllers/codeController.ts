import { Request, Response } from 'express';
import {PythonShell} from 'python-shell';

// Types
interface TestCase {
  input: any[];
  expected: number;
}

interface ChallengeDetails {
  title: string;
  difficulty: string;
  description: string;
  boilerplate: string;
  examples: Array<{
    input: string;
    output: string;
  }>;
  hints: string[];
}

// Test cases - in production this would come from a database
const testCases: Record<string, TestCase[]> = {
  'calculate_sum': [
    { input: [1, 2, 3, 4, 5], expected: 15 },
    { input: [-1, 0, 1], expected: 0 },
    { input: [10], expected: 10 },
    { input: [], expected: 0 }
  ]
};

// Challenge details - in production this would come from a database
const challengeDetails: Record<string, ChallengeDetails> = {
  'calculate_sum': {
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
  }
};

// Helper function to run Python tests
const runPythonTests = async (code: string, testCase: TestCase): Promise<{
  passed: boolean;
  output?: string;
  expected?: number;
  error?: string;
}> => {
  try {
    const fullCode = `
${code}

# Test execution
result = calculate_sum(${JSON.stringify(testCase.input)})
print(result)
`;

    const options = {
      mode: 'text' as const,
      pythonPath: 'python3',
      pythonOptions: ['-u'], // unbuffered output
    };

    const results = await PythonShell.runString(fullCode, options);
    const output = results[results.length - 1];
    
    return {
      passed: Number(output) === testCase.expected,
      output,
      expected: testCase.expected
    };
  } catch (err) {
    return {
      passed: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};

export const executePythonCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, challengeId } = req.body;

    // Validate input
    if (!code || !challengeId) {
      res.status(400).json({ error: 'Missing code or challengeId' });
      return;
    }

    // Get test cases for this challenge
    const challenges = testCases[challengeId];
    if (!challenges) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    // Run all test cases
    const results = await Promise.all(
      challenges.map(testCase => runPythonTests(code, testCase))
    );

    // Calculate overall results
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const allPassed = passedTests === totalTests;

    res.json({
      success: true,
      allPassed,
      results: {
        total: totalTests,
        passed: passedTests,
        testResults: results
      }
    });
  } catch (error) {
    console.error('Error executing Python code:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getChallengeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const challenge = challengeDetails[id];
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};