import { Employee, EmployeeProps } from '../../domain/entities/Employee';
import { EmployeeRepository } from '../../domain/interfaces/EmployeeRepository';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  private employees: Employee[] = [];

  constructor() {
    // Initialize with more comprehensive mock data
    this.employees = [
      Employee.create({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        position: 'Senior Developer',
        joinDate: new Date('2020-01-01'),
        performanceScore: 85,
        lastReviewDate: new Date('2023-12-01'),
        status: 'active'
      }),
      Employee.create({
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        joinDate: new Date('2019-06-15'),
        performanceScore: 92,
        lastReviewDate: new Date('2023-12-15'),
        status: 'active'
      }),
      Employee.create({
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@example.com',
        department: 'Engineering',
        position: 'Lead Developer',
        joinDate: new Date('2018-03-10'),
        performanceScore: 88,
        lastReviewDate: new Date('2023-11-20'),
        status: 'active'
      }),
      Employee.create({
        id: '4',
        firstName: 'Emily',
        lastName: 'Williams',
        email: 'emily.williams@example.com',
        department: 'Marketing',
        position: 'Content Strategist',
        joinDate: new Date('2021-02-18'),
        performanceScore: 79,
        lastReviewDate: new Date('2023-12-05'),
        status: 'active'
      }),
      Employee.create({
        id: '5',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@example.com',
        department: 'Sales',
        position: 'Sales Manager',
        joinDate: new Date('2019-11-05'),
        performanceScore: 95,
        lastReviewDate: new Date('2023-12-10'),
        status: 'active'
      }),
      Employee.create({
        id: '6',
        firstName: 'Sarah',
        lastName: 'Miller',
        email: 'sarah.miller@example.com',
        department: 'Sales',
        position: 'Account Executive',
        joinDate: new Date('2020-08-12'),
        performanceScore: 82,
        lastReviewDate: new Date('2023-11-30'),
        status: 'active'
      }),
      Employee.create({
        id: '7',
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@example.com',
        department: 'HR',
        position: 'HR Director',
        joinDate: new Date('2017-05-22'),
        performanceScore: 91,
        lastReviewDate: new Date('2023-12-18'),
        status: 'active'
      }),
      Employee.create({
        id: '8',
        firstName: 'Jessica',
        lastName: 'Taylor',
        email: 'jessica.taylor@example.com',
        department: 'HR',
        position: 'Recruiting Specialist',
        joinDate: new Date('2021-09-08'),
        performanceScore: 77,
        lastReviewDate: new Date('2023-11-25'),
        status: 'active'
      }),
      Employee.create({
        id: '9',
        firstName: 'Robert',
        lastName: 'Davis',
        email: 'robert.davis@example.com',
        department: 'Engineering',
        position: 'DevOps Engineer',
        joinDate: new Date('2020-04-30'),
        performanceScore: 89,
        lastReviewDate: new Date('2023-12-08'),
        status: 'active'
      }),
      Employee.create({
        id: '10',
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.anderson@example.com',
        department: 'Marketing',
        position: 'Digital Marketing Specialist',
        joinDate: new Date('2019-10-15'),
        performanceScore: 84,
        lastReviewDate: new Date('2023-12-03'),
        status: 'active'
      }),
    ];
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employees.find(emp => emp.getId() === id) || null;
  }

  async findAll(): Promise<Employee[]> {
    return [...this.employees];
  }

  async findByDepartment(department: string): Promise<Employee[]> {
    return this.employees.filter(emp => emp.getDepartment() === department);
  }

  async save(employee: Employee): Promise<void> {
    this.employees.push(employee);
  }

  async update(employee: Employee): Promise<void> {
    const index = this.employees.findIndex(emp => emp.getId() === employee.getId());
    if (index !== -1) {
      this.employees[index] = employee;
    }
  }

  async delete(id: string): Promise<void> {
    this.employees = this.employees.filter(emp => emp.getId() !== id);
  }

  async getPerformanceStats(): Promise<{
    averageScore: number;
    departmentAverages: { [key: string]: number };
    topPerformers: Employee[];
  }> {
    const departmentScores: { [key: string]: number[] } = {};
    
    this.employees.forEach(emp => {
      const dept = emp.getDepartment();
      if (!departmentScores[dept]) {
        departmentScores[dept] = [];
      }
      departmentScores[dept].push(emp.getPerformanceScore());
    });

    const departmentAverages: { [key: string]: number } = {};
    Object.entries(departmentScores).forEach(([dept, scores]) => {
      departmentAverages[dept] = scores.reduce((a, b) => a + b, 0) / scores.length;
    });

    const averageScore = this.employees.reduce((sum, emp) => sum + emp.getPerformanceScore(), 0) / this.employees.length;
    
    const topPerformers = [...this.employees]
      .sort((a, b) => b.getPerformanceScore() - a.getPerformanceScore())
      .slice(0, 3);

    return {
      averageScore,
      departmentAverages,
      topPerformers
    };
  }
} 