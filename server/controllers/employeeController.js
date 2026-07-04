const Employee = require('../models/Employee');

/**
 * Helper to calculate salary components based on Month Wage
 * @param {number} monthWage 
 * @returns {object} Calculated components, contributions, and deductions
 */
function calculateSalaryComponents(monthWage) {
  // 1. Basic Salary = 50.00% of Month Wage
  const basic = Math.round((monthWage * 0.50) * 100) / 100;
  
  // 2. HRA = 50.00% of Basic Salary
  const hra = Math.round((basic * 0.50) * 100) / 100;
  
  // 3. Standard Allowance = 16.67% of Basic Salary (approx 4167.50 for 25000 basic)
  const standardAllowance = Math.round((basic * 0.1667) * 100) / 100;
  
  // 4. Performance Bonus = 8.33% of Basic Salary (approx 2082.50 for 25000 basic)
  const performanceBonus = Math.round((basic * 0.0833) * 100) / 100;
  
  // 5. Leave Travel Allowance (LTA) = 8.33% of Basic Salary (approx 2082.50 for 25000 basic)
  const leaveTravelAllowance = Math.round((basic * 0.0833) * 100) / 100;
  
  // 6. Fixed Allowance = Month Wage - (Basic + HRA + Standard + Performance + LTA)
  const sumOfOtherComponents = basic + hra + standardAllowance + performanceBonus + leaveTravelAllowance;
  const fixedAllowance = Math.round((monthWage - sumOfOtherComponents) * 100) / 100;

  // 7. Provident Fund (PF) Contribution = 12% of Basic Salary
  const employeePF = Math.round((basic * 0.12) * 100) / 100;
  const employerPF = Math.round((basic * 0.12) * 100) / 100;

  // 8. Tax Deductions: Professional Tax = 200 (fixed amount)
  const professionalTax = 200;

  // Gross and Net Estimates
  const totalDeductions = employeePF + professionalTax;
  const takeHomePay = Math.max(0, monthWage - totalDeductions);

  return {
    monthWage,
    yearlyWage: monthWage * 12,
    basic,
    hra,
    standardAllowance,
    performanceBonus,
    leaveTravelAllowance,
    fixedAllowance,
    employeePF,
    employerPF,
    professionalTax,
    totalDeductions,
    takeHomePay
  };
}

/**
 * Fetch profile details for the logged in user
 */
async function getEmployeeProfile(req, res, next) {
  try {
    const employeeId = req.user.employeeId;
    let employee = await Employee.findOne({ employeeId });

    // If profile document does not exist, automatically seed default one for a seamless UX
    if (!employee) {
      const emailPrefix = req.user.email.split('@')[0];
      const firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      
      employee = new Employee({
        employeeId,
        firstName,
        lastName: 'Employee',
        personalEmail: req.user.email,
        jobTitle: req.user.role === 'hr' ? 'HR Specialist' : 'Software Engineer',
        department: req.user.role === 'hr' ? 'Human Resources' : 'Engineering'
      });
      await employee.save();
    }

    return res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update allowed fields in employee profile
 */
async function updateEmployeeProfile(req, res, next) {
  try {
    const employeeId = req.user.employeeId;
    let employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    // Role check: If regular employee, lock down read-only admin fields
    if (req.user.role !== 'hr') {
      const permittedUpdates = [
        'phone',
        'personalEmail',
        'about',
        'whatILoveAboutMyJob',
        'interestsHobbies',
        'skills',
        'certifications',
        'profilePicture',
        'dateOfBirth',
        'residingAddress',
        'nationality',
        'gender',
        'maritalStatus',
        'bankDetails'
      ];

      // Copy only allowed fields from req.body to employee document
      permittedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (field === 'bankDetails') {
            // Merge bank details fields carefully
            employee.bankDetails = {
              ...employee.bankDetails,
              ...req.body.bankDetails
            };
          } else {
            employee[field] = req.body[field];
          }
        }
      });
    } else {
      // HR/Admin role can modify all fields including jobs and salary parameters
      const fields = Object.keys(req.body);
      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (field === 'bankDetails') {
            employee.bankDetails = {
              ...employee.bankDetails,
              ...req.body.bankDetails
            };
          } else if (field === 'salaryDetails') {
            employee.salaryDetails = {
              ...employee.salaryDetails,
              ...req.body.salaryDetails
            };
          } else {
            employee[field] = req.body[field];
          }
        }
      });
    }

    await employee.save();

    return res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieve dynamic salary calculations for the logged in user
 */
async function getEmployeeSalary(req, res, next) {
  try {
    const employeeId = req.user.employeeId;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    const { monthWage, workingDaysPerWeek, breakTimeHours } = employee.salaryDetails;
    const calculations = calculateSalaryComponents(monthWage);

    return res.status(200).json({
      success: true,
      data: {
        employeeId,
        fullName: `${employee.firstName} ${employee.lastName}`,
        workingDaysPerWeek,
        breakTimeHours,
        salaryStructure: calculations
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Modify employee salary settings (HR/Admin restricted)
 */
async function updateEmployeeSalary(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { monthWage, workingDaysPerWeek, breakTimeHours } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee profile with ID ${employeeId} not found`
      });
    }

    if (monthWage !== undefined) employee.salaryDetails.monthWage = monthWage;
    if (workingDaysPerWeek !== undefined) employee.salaryDetails.workingDaysPerWeek = workingDaysPerWeek;
    if (breakTimeHours !== undefined) employee.salaryDetails.breakTimeHours = breakTimeHours;

    await employee.save();

    const calculations = calculateSalaryComponents(employee.salaryDetails.monthWage);

    return res.status(200).json({
      success: true,
      message: 'Employee salary configuration updated successfully',
      data: {
        employeeId,
        workingDaysPerWeek: employee.salaryDetails.workingDaysPerWeek,
        breakTimeHours: employee.salaryDetails.breakTimeHours,
        salaryStructure: calculations
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmployeeProfile,
  updateEmployeeProfile,
  getEmployeeSalary,
  updateEmployeeSalary
};
