import { Employee } from '../Employee';

describe('Employee', () => {
  const mockEmployeeProps = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: new Date('2020-01-01'),
    performanceScore: 85,
    lastReviewDate: new Date('2023-12-01'),
    status: 'active' as const
  };

  it('should create an employee instance', () => {
    const employee = Employee.create(mockEmployeeProps);
    expect(employee).toBeDefined();
  });

  it('should return correct full name', () => {
    const employee = Employee.create(mockEmployeeProps);
    expect(employee.getFullName()).toBe('John Doe');
  });

  it('should update performance score', () => {
    const employee = Employee.create(mockEmployeeProps);
    employee.updatePerformanceScore(90);
    expect(employee.getPerformanceScore()).toBe(90);
  });

  it('should throw error for invalid performance score', () => {
    const employee = Employee.create(mockEmployeeProps);
    expect(() => employee.updatePerformanceScore(101)).toThrow('Performance score must be between 0 and 100');
    expect(() => employee.updatePerformanceScore(-1)).toThrow('Performance score must be between 0 and 100');
  });

  it('should update status', () => {
    const employee = Employee.create(mockEmployeeProps);
    employee.updateStatus('inactive');
    expect(employee.getStatus()).toBe('inactive');
  });

  it('should update last review date', () => {
    const employee = Employee.create(mockEmployeeProps);
    const newDate = new Date('2024-01-01');
    employee.updateLastReviewDate(newDate);
    expect(employee.getLastReviewDate()).toEqual(newDate);
  });
}); 