import React from 'react';

export default function SalaryInfo() {
  // Configured logic metrics matching UI document notes
  const baseMonthlyWage = 50000;
  const yearlyWage = baseMonthlyWage * 12;

  // Breakdown percentages and values matching specification calculations
  const basicSalary = baseMonthlyWage * 0.50; // 50%
  const hra = basicSalary * 0.50;           // 50% of Basic
  const standardAllowance = 4167.00;         // Fixed Amount
  const performanceBonus = baseMonthlyWage * 0.0833; // 8.33%
  const leaveTravelAllowance = baseMonthlyWage * 0.0833; // 8.33%
  const fixedAllowance = baseMonthlyWage - (basicSalary + hra + standardAllowance + performanceBonus + leaveTravelAllowance);

  // Statutory settings
  const pfContribution = 3000.00; // 12% of basic
  const professionalTax = 200.00;

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Salary Info Structure</h3>
        <span style={{ backgroundColor: '#e53935', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
          READ ONLY (Admin View Only Access to Modify)
        </span>
      </div>

      {/* Top Level Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <div>
          <p style={{ margin: '8px 0' }}><strong>Month Wage:</strong> ₹ {baseMonthlyWage.toLocaleString()} / Month</p>
          <p style={{ margin: '8px 0' }}><strong>Yearly Wage:</strong> ₹ {yearlyWage.toLocaleString()} / Yearly</p>
        </div>
        <div>
          <p style={{ margin: '8px 0' }}><strong>No. of Working Days in Week:</strong> 5 days</p>
          <p style={{ margin: '8px 0' }}><strong>Break Time:</strong> 1 Hour/day</p>
        </div>
      </div>

      {/* Breakdowns container split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
        
        {/* Salary Components */}
        <div>
          <h4 style={{ borderBottom: '1px solid #555', paddingBottom: '5px' }}>Salary Components</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#aaa' }}>
                <th style={{ padding: '8px 0' }}>Component</th>
                <th>Monthly Amount</th>
                <th>Percentage Structure</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>Basic Salary</strong><br/><small style={{color:'#777'}}>50% of monthly wages</small></td>
                <td>₹ {basicSalary.toFixed(2)}</td>
                <td>50.00 %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>House Rent Allowance (HRA)</strong><br/><small style={{color:'#777'}}>50% of basic salary</small></td>
                <td>₹ {hra.toFixed(2)}</td>
                <td>50.00 %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>Standard Allowance</strong><br/><small style={{color:'#777'}}>Predetermined fixed amount</small></td>
                <td>₹ {standardAllowance.toFixed(2)}</td>
                <td>16.67 %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>Performance Bonus</strong><br/><small style={{color:'#777'}}>Value defined relative to company structure</small></td>
                <td>₹ {performanceBonus.toFixed(2)}</td>
                <td>8.33 %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>Leave Travel Allowance</strong><br/><small style={{color:'#777'}}>LTA paid relative to packages</small></td>
                <td>₹ {leaveTravelAllowance.toFixed(2)}</td>
                <td>8.33 %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                <td style={{ padding: '10px 0' }}><strong>Fixed Allowance</strong><br/><small style={{color:'#777'}}>Remaining portion of wages</small></td>
                <td>₹ {fixedAllowance.toFixed(2)}</td>
                <td>11.67 %</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions & Funds */}
        <div>
          <h4 style={{ borderBottom: '1px solid #555', paddingBottom: '5px' }}>Provident Fund (PF) Contribution</h4>
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Employee Share (12%):</span>
              <span>₹ {pfContribution.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
              <span>Employer Share (12%):</span>
              <span>₹ {pfContribution.toFixed(2)}</span>
            </div>
          </div>

          <h4 style={{ borderBottom: '1px solid #555', paddingBottom: '5px', marginTop: '30px' }}>Tax Deductions</h4>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Professional Tax (PT):</span>
            <span>₹ {professionalTax.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}