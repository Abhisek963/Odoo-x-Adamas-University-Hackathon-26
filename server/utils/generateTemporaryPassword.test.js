const { generateTemporaryPassword } = require('./generateTemporaryPassword');

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialRegex = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/;

let failedTestsCount = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`✅ PASS: ${testName}`);
  } catch (error) {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Error message: "${error.message}"\n`);
    failedTestsCount++;
  }
}

console.log('==================================================');
console.log('🧪 Starting manual tests for generateTemporaryPassword...');
console.log('==================================================\n');

// 1. Test case: Default password length is 12
runTest('1. Default password length is 12', () => {
  const pwd = generateTemporaryPassword();
  if (pwd.length !== 12) {
    throw new Error(`Expected length 12, got ${pwd.length}`);
  }
});

// 2. Test case: Custom password length 16 works
runTest('2. Custom password length 16 works', () => {
  const pwd = generateTemporaryPassword(16);
  if (pwd.length !== 16) {
    throw new Error(`Expected length 16, got ${pwd.length}`);
  }
});

// 3. Test case: Password contains at least one uppercase letter
runTest('3. Password contains at least one uppercase letter', () => {
  const pwd = generateTemporaryPassword();
  if (!uppercaseRegex.test(pwd)) {
    throw new Error('Password does not contain an uppercase letter');
  }
});

// 4. Test case: Password contains at least one lowercase letter
runTest('4. Password contains at least one lowercase letter', () => {
  const pwd = generateTemporaryPassword();
  if (!lowercaseRegex.test(pwd)) {
    throw new Error('Password does not contain a lowercase letter');
  }
});

// 5. Test case: Password contains at least one number
runTest('5. Password contains at least one number', () => {
  const pwd = generateTemporaryPassword();
  if (!numberRegex.test(pwd)) {
    throw new Error('Password does not contain a number');
  }
});

// 6. Test case: Password contains at least one special character
runTest('6. Password contains at least one special character', () => {
  const pwd = generateTemporaryPassword();
  if (!specialRegex.test(pwd)) {
    throw new Error('Password does not contain a special character');
  }
});

// 7. Test case: Length below 8 throws an error
runTest('7. Length below 8 throws an error', () => {
  let threw = false;
  try {
    generateTemporaryPassword(7);
  } catch (error) {
    threw = true;
    if (!error.message.includes('length')) {
      throw new Error(`Unexpected error message: "${error.message}"`);
    }
  }
  if (!threw) {
    throw new Error('Did not throw error for length < 8');
  }
});

// 8. Test case: Generate multiple passwords and verify they are not all identical
runTest('8. Generate multiple passwords and verify they are not all identical', () => {
  const pwdSet = new Set();
  const count = 20;
  for (let i = 0; i < count; i++) {
    pwdSet.add(generateTemporaryPassword(12));
  }
  if (pwdSet.size !== count) {
    throw new Error(`Generated duplicates in a batch of ${count}: set size was ${pwdSet.size}`);
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
