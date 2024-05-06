import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReportsService } from 'src/reports/reports.service';
import { UsersService } from 'src/users/users.service';

export class AdminGuard implements CanActivate {
  constructor(private userService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
