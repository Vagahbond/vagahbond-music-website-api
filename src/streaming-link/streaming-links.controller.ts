import { Body, Controller, Delete, HttpCode, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNoContentResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UnauthorizedResponse } from "src/auth/unauthorized-response";
import AffectedResponse from "src/common/dto/affected-response.dto";
import { BadRequestResponse } from "src/common/dto/bad-request-response.dto";
import { TracksService } from "src/tracks/tracks.service";
import { CreateStreamingLinkDTO } from "./dto/create-streaming-link.dto";
import { FindStreamingLinkDTO } from "./dto/find-streaming-link.dto";
import { StreamingLinkService } from "./streaming-links.service";

@Controller('streaming_links')
export class StreamingLinkController {
  constructor(
    private readonly streamingLinkService: StreamingLinkService,
    private readonly tracksService: TracksService,
  ) { }

  @ApiOperation({ summary: 'Post a streaming link' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateStreamingLinkDTO, description: 'post a streaming link' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid token',
  })
  @UseGuards(AuthGuard('headerapikey'))
  @Post()
  async create(
    @Body() createStreamingLinkDTO: CreateStreamingLinkDTO,
  ): Promise<AffectedResponse> {
    const track = await this.tracksService.findOne({ id: createStreamingLinkDTO.track })
    
    if (track === undefined) {
      throw new NotFoundException('This track does not exist.')
    }

    this.tracksService.update(
      { id: track.id }, 
      { streamingLinks: [{  ...createStreamingLinkDTO, track: track,},]}, 
      track)

    const link = this.streamingLinkService.create(
      {
        ...createStreamingLinkDTO,
        track,
      })

    return {
      message: 'Streaming link was added.',
      url: `/streaming_links/${(await link).id}`
    }
  }

  @ApiOperation({ summary: 'Delete streaming link' })
  @ApiNoContentResponse({ description: 'Deletion successful' })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'invalid input',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponse,
    description: 'Invalid auth token',
  })
  @ApiParam({ name: 'id', type: FindStreamingLinkDTO, required: true})
  @HttpCode(204)
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.streamingLinkService.delete({ id });
  }
}
