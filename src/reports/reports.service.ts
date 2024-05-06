import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`report ${id} is not found`);
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async getSpecificReport(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model=:model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND +5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND +5', { lat })
      .andWhere('year - :year BETWEEN -2 AND +2', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
