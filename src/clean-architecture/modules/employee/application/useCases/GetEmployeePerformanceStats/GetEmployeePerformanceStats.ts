import { EmployeeRepository } from '../../../domain/interfaces/EmployeeRepository';

export interface GetEmployeePerformanceStatsResponseDto {
  averageScore: number;
  departmentAverages: { [key: string]: number };
  topPerformers: Array<{
    id: string;
    fullName: string;
    department: string;
    performanceScore: number;
  }>;
}

export class GetEmployeePerformanceStats {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(): Promise<GetEmployeePerformanceStatsResponseDto> {
    const stats = await this.employeeRepository.getPerformanceStats();
    
    return {
      averageScore: stats.averageScore,
      departmentAverages: stats.departmentAverages,
      topPerformers: stats.topPerformers.map(employee => ({
        id: employee.getId(),
        fullName: employee.getFullName(),
        department: employee.getDepartment(),
        performanceScore: employee.getPerformanceScore()
      }))
    };
  }
} 