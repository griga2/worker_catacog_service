import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UploadBodyDto } from './dto/workers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkersService } from './workers.service';
import * as mongoose from 'mongoose'

@Controller('catalog')
export class WorkersController {

    constructor (private readonly workerService: WorkersService) {}

    @Get('/')
    async getUsers(@Query('branch') company: string) {
        console.log(company)
        return await this.workerService.getUsers(company);
    }

    @Get('/search')
    async getCatalog(@Query() company: string) {
        return await this.workerService.searchUsers('name');
    }

    @Get('/branches')
    async getBranches() {
        return await this.workerService.getBranches();
    }

    @Put('/branches')
    async putBranches(@Body() body, @Query('branchId') branchId: string) {
        return await this.workerService.updateBranch(branchId, body);
    }
}
