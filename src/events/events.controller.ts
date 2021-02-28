import { Controller, Post, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {  ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnauthorizedResponse } from "src/auth/dto/unauthorized-response.dto";
import { BadRequestResponse } from "src/shared/dto/bad-request-response.dto";
import { CreateEventsAPIBody } from "./dto/create-event-api-body.dto";

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  @ApiOperation({ summary: 'Post an event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateEventsAPIBody })
  @ApiCreatedResponse({ type: () => Event, description: 'Event object'})
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('cover_file'))
  @Post()
  async create(
    @Request() req: ValidatedJWTReq,
    @Body() createAlbumDTO: CreateAlbumDTO,
    @UploadedFile() coverFile: BufferedFile,
  ): Promise<Album> {
    if (!coverFile) {
      throw new BadRequestException('Missing cover_file');
    }

    const album = await this.albumsService.create(
      {
        ...createAlbumDTO,
        user: req.user,
      },
      coverFile,
    );

    return new Album(album);
  }

  
}