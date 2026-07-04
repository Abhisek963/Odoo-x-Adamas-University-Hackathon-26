const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    jobTitle: {
      type: String,
      default: 'Software Engineer',
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    personalEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true
    },
    company: {
      type: String,
      default: 'Adamas University',
      trim: true
    },
    department: {
      type: String,
      default: 'Engineering',
      trim: true
    },
    manager: {
      type: String,
      default: 'HR Manager',
      trim: true
    },
    location: {
      type: String,
      default: 'Kolkata, India',
      trim: true
    },
    about: {
      type: String,
      default: 'I am a passionate professional enjoying my role in developing solutions.',
      trim: true
    },
    whatILoveAboutMyJob: {
      type: String,
      default: 'Collaborating with highly talented individuals and solving complex real-world challenges.',
      trim: true
    },
    interestsHobbies: {
      type: String,
      default: 'Reading technology blogs, chess, hiking, and playing acoustic guitar.',
      trim: true
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB']
    },
    certifications: {
      type: [String],
      default: ['AWS Certified Developer', 'MongoDB Professional']
    },
    profilePicture: {
      type: String,
      default: '' // Can be a URL or a base64 encoded string
    },
    dateOfBirth: {
      type: Date,
      default: () => new Date('1998-05-15')
    },
    residingAddress: {
      type: String,
      default: '123 Tech Park Avenue, Kolkata, West Bengal, 700091',
      trim: true
    },
    nationality: {
      type: String,
      default: 'Indian',
      trim: true
    },
    gender: {
      type: String,
      default: 'Male',
      trim: true
    },
    maritalStatus: {
      type: String,
      default: 'Single',
      trim: true
    },
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    bankDetails: {
      accountNumber: {
        type: String,
        default: '32109876543',
        trim: true
      },
      bankName: {
        type: String,
        default: 'State Bank of India',
        trim: true
      },
      ifscCode: {
        type: String,
        default: 'SBIN0001234',
        trim: true
      },
      panNo: {
        type: String,
        default: 'ABCDE1234F',
        trim: true
      },
      uanNo: {
        type: String,
        default: '100987654321',
        trim: true
      }
    },
    salaryDetails: {
      monthWage: {
        type: Number,
        default: 50000,
        min: [0, 'Month wage cannot be negative']
      },
      workingDaysPerWeek: {
        type: Number,
        default: 5,
        min: 1,
        max: 7
      },
      breakTimeHours: {
        type: Number,
        default: 1,
        min: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Virtual field to get full name easily
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
