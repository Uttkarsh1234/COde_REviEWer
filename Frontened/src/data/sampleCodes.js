export const SAMPLE_CODES = [
  {
    id: 'js-memory-leak',
    name: 'JS: Event Listener Memory Leak',
    language: 'javascript',
    code: `// Express / Node.js Stream with Unhandled Memory Leak
const EventEmitter = require('events');
const eventBus = new EventEmitter();

function trackUserSession(userId) {
  const sessionData = {
    userId,
    loginTime: Date.now(),
    buffer: new Array(100000).fill("payload_chunk")
  };

  // Bug: Attaching listener without removing it on session end creates a leak
  eventBus.on('data_sync', (payload) => {
    console.log("Syncing session for user:", sessionData.userId, payload);
  });

  return sessionData;
}

// Simulating 500 active user sessions
for (let i = 0; i < 500; i++) {
  trackUserSession(\`user_\${i}\`);
}
`,
  },
  {
    id: 'py-slow-fib',
    name: 'Python: Inefficient O(2^N) Recursion',
    language: 'python',
    code: `# Inefficient Fibonacci without memoization (Exponential Time Complexity)
def fibonacci(n):
    # Calculates nth Fibonacci number
    if n < 0:
        raise ValueError("n must be non-negative")
    if n == 0:
        return 0
    elif n == 1:
        return 1
    # Bug: Redundant subtree recalculations lead to O(2^N) time complexity
    return fibonacci(n - 1) + fibonacci(n - 2)

def find_large_fib():
    numbers = [5, 10, 20, 35, 40]
    results = {}
    for num in numbers:
        results[num] = fibonacci(num)
    return results

print(find_large_fib())
`,
  },
  {
    id: 'sql-injection-bug',
    name: 'JavaScript: SQL Injection & Missing Await',
    language: 'javascript',
    code: `// Authentication Handler with Critical Vulnerability
const db = require('../db');

async function handleUserLogin(req, res) {
  const { username, password } = req.body;

  // Critical Bug 1: SQL Injection vulnerability via string concatenation
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  // Bug 2: Missing await on database promise call
  const userResult = db.query(query);

  if (userResult.rows && userResult.rows.length > 0) {
    res.json({ success: true, user: userResult.rows[0] });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
}
`,
  },
  {
    id: 'cpp-buffer-overflow',
    name: 'C++: Buffer Overflow & Unchecked Bounds',
    language: 'cpp',
    code: `#include <iostream>
#include <cstring>

void processUserData(const char* userInput) {
    char internalBuffer[16];
    
    // Critical Bug: strcpy does not check input boundary (Buffer Overflow)
    strcpy(internalBuffer, userInput);
    
    std::cout << "Buffer content: " << internalBuffer << std::endl;
}

int main() {
    const char* maliciousPayload = "ThisStringIsFarTooLongForTheBuffer";
    processUserData(maliciousPayload);
    return 0;
}
`,
  },
  {
    id: 'ts-async-race',
    name: 'TypeScript: Unhandled Promise & Race Condition',
    language: 'typescript',
    code: `interface CacheRecord {
  data: string;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheRecord>();

async function fetchWithCache(key: string, fetcher: () => Promise<string>): Promise<string> {
  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // Bug: Multiple concurrent callers will invoke fetcher multiple times (Race condition)
  const freshData = await fetcher();
  
  memoryCache.set(key, {
    data: freshData,
    expiresAt: Date.now() + 60000
  });

  return freshData;
}
`,
  },
  {
    id: 'go-goroutine-leak',
    name: 'Go: Deadlock & Goroutine Leak',
    language: 'go',
    code: `package main

import (
	"fmt"
	"time"
)

func queryDatabase(ch chan<- string) {
	time.Sleep(2 * time.Second)
	// Bug: If receiver times out and stops listening on unbuffered channel, this goroutine blocks forever
	ch <- "database_result_data"
}

func GetDataWithTimeout() (string, error) {
	ch := make(chan string) // Unbuffered channel
	go queryDatabase(ch)

	select {
	case res := <-ch:
		return res, nil
	case <-time.After(500 * time.Millisecond):
		return "", fmt.Errorf("query timed out")
	}
}
`,
  }
];

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'sql', label: 'SQL' },
  { value: 'php', label: 'PHP' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];
