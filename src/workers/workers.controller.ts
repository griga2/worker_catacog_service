import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadBodyDto } from './dto/workers.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkersService } from './workers.service';
import * as mongoose from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@Controller('catalog')
export class WorkersController {

    constructor (private readonly workerService: WorkersService) {}

    @Get('/')
    async getUsers(@Query('branch') company: string) {
        console.log(company)
        return await this.workerService.getEmployers(company);
    }

    @Get('/branch')
    async getCatalogInfo(@Query('branch') company: string) {
        console.log(company);
        return await this.workerService.getCatalogInfo(company);
    }

    @Get('/search')
    async getCatalog(@Query('text') company: string, @Query('date') date: string) {
        console.log(date)
        return await this.workerService.searchEmployers(company, date);
    }

    @Get('/branches')
    async getBranches() {
        return await this.workerService.getBranches();
    }

    @Put('/branch')
    async putBranches(@Body() body, @Query('branchId') branchId: string) {
        return await this.workerService.updateBranch(branchId, body);
    }

    @Put('/user')
    async updateUser(@Body() body, @Query('userId') userId: string) {
        return await this.workerService.updateUser(userId, body);
    }

    @Get('/roles')
    async getRoles() {
        return await this.workerService.getRoles();
    }

    @Post('/role')
    async addRoles(@Query('last_role_index') last_role_index,@Query('name') name) {
        return this.addRoles(last_role_index, name);
    }

    @Put('/role')
    async updateRoles(@Query('role') role) {
        return this.updateRoles(role);
    }

    @Put('/move_role')
    async moveRoles(@Query('role') role, @Query('axis') axis) {
       return this.moveRoles(role, axis);
    }

    @Put('/contact') 
    async updateContact(@Body() body) {
        return await this.workerService.CreateOrUpdateContact(body);
    }

    @Post('/upload_photo/:employerId')
    @UseInterceptors(FileInterceptor('image'))
    async uploadPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Param('employerId') id,
    ) {
        const rez = await this.workerService.UploadPhoto(file,id);
        return this.workerService.UpdateUserPhotoUrl(rez, id);
    }

    @Put('/insertBranch')
    async getInsertBranch(@Query('branchId') branchId, @Query('newFatherId') newFatherId) {
        await this.workerService.getInsertBranch(branchId, newFatherId);
        return await this.workerService.getBranches();
    }

    @Post('/moveBranch')
    async moveBranch(@Query('branchId') branchId, direction) {
        this.workerService.moveBranch(branchId, direction);
    }

    @Delete('/deleteBranch')
    async deleteBranch(@Query('branchId') branchId) {
        this.workerService.deleteBranch(branchId);
    }

    @Delete('/userRole')
    async updateUserRole(@Query('userId') userId, @Body() body) {
        return await this.workerService.updateUserRole(userId, body.role);
    }с
}
