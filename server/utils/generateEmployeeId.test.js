const { generateEmployeeId } = require('./generateEmployeeId');

const testCases = [
  {
    name: '1. Standard Case - John Doe 2022 Serial 1',
    args: ['John', 'Doe', 2022, 1],
    expected: 'OIJODO20220001',
    shouldThrow: false
  },
  {
    name: '2. Standard Case - Abhisek Singh 2026 Serial 25',
    args: ['Abhisek', 'Singh', 2026, 25],
    expected: 'OIABSI20260025',
    shouldThrow: false
  },
  {
    name: '3. Trim Extra Spaces - Spaces in Names and Year',
    args: ['   John   ', '   Doe   ', '  2022  ', 1],
    expected: 'OIJODO20220001',
    shouldThrow: false
  },
  {
    name: '4. Validation - Short First Name (< 2 chars)',
    args: ['J', 'Doe', 2022, 1],
    shouldThrow: true
  },
  {
    name: '5. Validation - Short Last Name (< 2 chars)',
    args: ['John', 'D', 2022, 1],
    shouldThrow: true
  },
  {
    name: '6. Validation - Serial Number Too Small (< 1)',
    args: ['John', 'Doe', 2022, 0],
    shouldThrow: true
  },
  {
    name: '7. Validation - Serial Number Too Large (> 9999)',
    args: ['John', 'Doe', 2022, 10000],
    shouldThrow: true
  },
  {
    name: '8. Validation - Invalid 3-Digit Year',
    args: ['John', 'Doe', 999, 1],
    shouldThrow: true
  },
  {
    name: '9. Validation - Invalid 5-Digit Year',
    args: ['John', 'Doe', 20260, 1],
    shouldThrow: true
  }
];

let failedTestsCount = 0;

console.log('==================================================');
console.log('🧪 Starting manual tests for generateEmployeeId...');
console.log('==================================================\n');

testCases.forEach((tc) => {
  try {
    const result = generateEmployeeId(...tc.args);
    if (tc.shouldThrow) {
      console.log(`❌ FAIL: ${tc.name}`);
      console.log(`   Expected an error to be thrown, but got return value: "${result}"\n`);
      failedTestsCount++;
    } else if (result !== tc.expected) {
      console.log(`❌ FAIL: ${tc.name}`);
      console.log(`   Expected: "${tc.expected}"`);
      console.log(`   Got:      "${result}"\n`);
      failedTestsCount++;
    } else {
      console.log(`✅ PASS: ${tc.name}`);
    }
  } catch (error) {
    if (tc.shouldThrow) {
      console.log(`✅ PASS: ${tc.name} (Successfully caught error: "${error.message}")`);
    } else {
      console.log(`❌ FAIL: ${tc.name}`);
      console.log(`   Unexpected error thrown: "${error.message}"\n`);
      failedTestsCount++;
    }
  }
});

console.log('\n==================================================');
if (failedTestsCount === 0) {
  console.log('🎉 PASS: All tests passed successfully!');
  console.log('==================================================');
  process.exit(0);
} else {
  console.log(`💥 FAIL: ${failedTestsCount} test(s) failed.`);
  console.log('==================================================');
  process.exit(1);
}
