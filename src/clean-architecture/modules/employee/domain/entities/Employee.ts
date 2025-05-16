export interface EmployeeProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  joinDate: Date;
  performanceScore: number;
  lastReviewDate: Date;
  status: 'active' | 'inactive';
}

export class Employee {
  private props: EmployeeProps;

  private constructor(props: EmployeeProps) {
    this.props = props;
  }

  static create(props: EmployeeProps): Employee {
    return new Employee(props);
  }

  // Getters
  getId(): string { return this.props.id; }
  getFirstName(): string { return this.props.firstName; }
  getLastName(): string { return this.props.lastName; }
  getFullName(): string { return `${this.props.firstName} ${this.props.lastName}`; }
  getEmail(): string { return this.props.email; }
  getDepartment(): string { return this.props.department; }
  getPosition(): string { return this.props.position; }
  getJoinDate(): Date { return this.props.joinDate; }
  getPerformanceScore(): number { return this.props.performanceScore; }
  getLastReviewDate(): Date { return this.props.lastReviewDate; }
  getStatus(): 'active' | 'inactive' { return this.props.status; }

  // Business methods
  updatePerformanceScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error('Performance score must be between 0 and 100');
    }
    this.props.performanceScore = score;
  }

  updateStatus(status: 'active' | 'inactive'): void {
    this.props.status = status;
  }

  updateLastReviewDate(date: Date): void {
    this.props.lastReviewDate = date;
  }
} 