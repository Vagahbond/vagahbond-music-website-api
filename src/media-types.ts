export type MediaTypeEnum = typeof ImageFileMediaTypes | typeof AudioFileMediaTypes;

export enum ImageFileMediaTypes {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
};

export enum AudioFileMediaTypes {
  MP3 = 'audio/mpeg3',
  MPEG = 'audio/mpeg',
  WAV = 'audio/WAV',
};
