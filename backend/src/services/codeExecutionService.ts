import { PythonShell } from 'python-shell';
import { TestResult, TestCase } from 'shared';

export class CodeExecutionService {
  async runTests(code: string, testCases: TestCase[]): Promise<TestResult[]> {
    return Promise.all(testCases.map(testCase => this.runSingleTest(code, testCase)));
  }

  private async runSingleTest(code: string, testCase: TestCase): Promise<TestResult> {
    try {
      // Check if code contains a function definition
      const functionMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      
      let fullCode;
      if (functionMatch) {
        // Function-based challenge
        const functionName = functionMatch[1];
        fullCode = `
${code}

# Test execution
result = ${functionName}(${testCase.input.map(arg => JSON.stringify(arg)).join(', ')})
print(result)`;
      } else {
        // Direct code execution
        fullCode = `
${code}

# Test execution
${testCase.input.length > 0 ? '# Input values available but not used in this challenge' : ''}
print(${testCase.expected instanceof String ? 'str(' : ''}x${testCase.expected instanceof String ? ')' : ''})`;
      }

      const options = {
        mode: 'text' as const,
        pythonPath: 'python3',
        pythonOptions: ['-u'], // unbuffered output
      };

      const results = await PythonShell.runString(fullCode, options);
      const output = results[results.length - 1];
      
      // Compare the output with expected result
      return {
        passed: String(output).trim() === String(testCase.expected),
        output: output.trim(),
        expected: testCase.expected
      };
    } catch (err) {
      return {
        passed: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      };
    }
  }

  async validateCode(_code: string): Promise<boolean> {
    // Add code validation logic here (e.g., check for dangerous operations)
    return true;
  }
}