import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('App Controller')
export class AppController {}
