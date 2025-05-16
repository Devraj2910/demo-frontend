import { EmployeeRepository } from '../../../domain/interfaces/EmployeeRepository';

export interface EmployeeDto {
  id: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  performanceScore: number;
  status: 'active' | 'inactive';
  joinDate: Date;
  lastReviewDate: Date;
}

export class GetAllEmployees {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(): Promise<EmployeeDto[]> {
    const employees = await this.employeeRepository.findAll();
    
    return employees.map(employee => ({
      id: employee.getId(),
      fullName: employee.getFullName(),
      email: employee.getEmail(),
      department: employee.getDepartment(),
      position: employee.getPosition(),
      performanceScore: employee.getPerformanceScore(),
      status: employee.getStatus(),
      joinDate: employee.getJoinDate(),
      lastReviewDate: employee.getLastReviewDate()
    }));
  }
} 