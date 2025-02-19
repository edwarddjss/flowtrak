import { InterviewQuestion } from '@/types/interview'
import { TestCase } from './code-execution'

export interface CodingQuestion extends InterviewQuestion {
  testCases: TestCase[]
  functionName: string
  parameters: {
    name: string
    type: string
    description: string
  }[]
  returnType: string
  constraints: string[]
  timeComplexity: string
  spaceComplexity: string
  hints: string[]
}

export const codingQuestions: CodingQuestion[] = [
  {
    id: 'algo1',
    type: 'technical',
    question: 'Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    category: 'arrays',
    difficulty: 'easy',
    functionName: 'twoSum',
    parameters: [
      {
        name: 'nums',
        type: 'number[]',
        description: 'Array of integers'
      },
      {
        name: 'target',
        type: 'number',
        description: 'Target sum'
      }
    ],
    returnType: 'number[]',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expectedOutput: [0, 1],
        description: 'Basic case with positive numbers'
      },
      {
        input: [[3, 2, 4], 6],
        expectedOutput: [1, 2],
        description: 'Numbers not in sorted order'
      },
      {
        input: [[-1, -2, -3, -4, -5], -8],
        expectedOutput: [2, 4],
        description: 'Negative numbers'
      }
    ],
    hints: [
      'Consider using a hash map to store previously seen numbers',
      'For each number, check if its complement (target - num) exists in the hash map',
      'Remember to handle edge cases like duplicate numbers'
    ],
    expectedPoints: [
      'Use an efficient approach (hash map for O(n) time complexity)',
      'Handle edge cases properly',
      'Return correct indices in any order',
      'Use appropriate variable names and add comments',
      'Consider space complexity in the solution'
    ]
  },
  {
    id: 'algo2',
    type: 'technical',
    question: 'Valid Parentheses: Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order.',
    category: 'stacks',
    difficulty: 'easy',
    functionName: 'isValid',
    parameters: [
      {
        name: 's',
        type: 'string',
        description: 'String containing only parentheses'
      }
    ],
    returnType: 'boolean',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    testCases: [
      {
        input: ['()'],
        expectedOutput: true,
        description: 'Simple valid case'
      },
      {
        input: ['()[]{}'],
        expectedOutput: true,
        description: 'Multiple valid pairs'
      },
      {
        input: ['(]'],
        expectedOutput: false,
        description: 'Mismatched brackets'
      },
      {
        input: ['([)]'],
        expectedOutput: false,
        description: 'Wrong order of closing'
      }
    ],
    hints: [
      'Consider using a stack data structure',
      'Push opening brackets onto the stack',
      'When encountering a closing bracket, check if it matches the top of the stack'
    ],
    expectedPoints: [
      'Use a stack for tracking open brackets',
      'Handle all types of brackets correctly',
      'Check for proper closing order',
      'Return false for invalid cases',
      'Consider empty string case'
    ]
  },
  // Add more questions here...
]

export function getRandomQuestion(difficulty: 'easy' | 'medium' | 'hard'): CodingQuestion {
  const filteredQuestions = codingQuestions.filter(q => q.difficulty === difficulty)
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
  return filteredQuestions[randomIndex]
}

export function getQuestionById(id: string): CodingQuestion | undefined {
  return codingQuestions.find(q => q.id === id)
}

export function getLanguageTemplate(language: string, question: CodingQuestion): string {
  const paramList = question.parameters.map(p => `${p.name}: ${p.type}`).join(', ')
  
  switch (language) {
    case 'javascript':
      return `/**
 * ${question.question}
 * @param {${question.parameters.map(p => p.type).join(', ')}} ${question.parameters.map(p => p.name).join(', ')}
 * @return {${question.returnType}}
 */
function ${question.functionName}(${paramList}) {
  // Write your solution here
  
}`
    case 'typescript':
      return `/**
 * ${question.question}
 */
function ${question.functionName}(${paramList}): ${question.returnType} {
  // Write your solution here
  
}`
    case 'python':
      return `def ${question.functionName}(${question.parameters.map(p => p.name).join(', ')}) -> ${question.returnType}:
    """
    ${question.question}
    """
    # Write your solution here
    pass`
    case 'java':
      return `/**
 * ${question.question}
 */
public class Solution {
    public ${question.returnType} ${question.functionName}(${paramList}) {
        // Write your solution here
        
    }
}`
    case 'cpp':
      return `/**
 * ${question.question}
 */
${question.returnType} ${question.functionName}(${paramList}) {
    // Write your solution here
    
}`
    default:
      return ''
  }
}
