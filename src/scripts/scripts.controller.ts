import { Body, Controller, Post } from '@nestjs/common';
import { ScriptsService } from './scripts.service';

@Controller('scripts')
export class ScriptsController {
    constructor (private readonly workerService: ScriptsService) {}

    @Post("")
    async ImportpDepartments(@Body() RawBody) {
        return await this.workerService.importBranches(RawBody)
    }
}
