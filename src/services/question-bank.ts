export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string[];
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: TestCase[];
  templates: Record<string, string>;
  timeLimit?: number; // in milliseconds
  memoryLimit?: number; // in MB
}

const questions: CodingQuestion[] = [
  {
    id: '1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    category: ['arrays', 'hash-table'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    testCases: [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]'
      },
      {
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]'
      }
    ],
    templates: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your code here
  
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    
`
    }
  }
]

export const questionBank = questions;
