const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Excludes password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['employee', 'hr'],
        message: '{VALUE} is not a valid role'
      },
      default: 'employee'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    mustChangePassword: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash the password before saving a User document
// Note: We use standard function syntax instead of arrow syntax to preserve the 'this' context
userSchema.pre('save', async function () {
  // Only hash the password if it is new or has been modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error('Error hashing password in pre-save hook:', error);
    throw error; // Re-throw to reject the save promise
  }
});

// Schema instance method to compare candidate plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Using bcrypt to compare the plain-text password with the hashed password
    // Note: Since 'select: false' is set on the password, this.password must be
    // explicitly selected in queries before calling this method
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
