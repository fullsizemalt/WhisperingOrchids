import { Parser } from 'binary-parser';

const paneParser = new Parser()
  .uint8('flags')
  .uint8('origin')
  .uint8('alpha')
  .uint8('padding')
  .string('paneName', { length: 24, stripNull: true })
  .floatle('positionX')
  .floatle('positionY')
  .floatle('positionZ')
  .floatle('rotationX')
  .floatle('rotationY')
  .floatle('rotationZ')
  .floatle('scaleX')
  .floatle('scaleY')
  .floatle('width')
  .floatle('height');

const pic1Parser = paneParser
  .array('vertexColors', { type: 'uint32le', length: 4 })
  .uint16('materialIndex')
  .uint16('textureCount')
  .array('texCoords', { type: 'floatle', length: 8 });

const txt1Parser = paneParser
  .uint16('textLength')
  .uint16('materialIndex')
  .uint16('fontIndex')
  .uint8('lineAlignment')
  .uint8('textAlignment')
  .uint32('textOffset')
  .uint32('fontColor')
  .floatle('charSpacing')
  .floatle('lineSpacing')
  .uint32('shadowColor')
  .floatle('shadowOffsetX')
  .floatle('shadowOffsetY')
  .string('text', { length: 'textLength', encoding: 'utf16le' });

export class BflytParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser()
      .string('signature', { length: 4 })
      .uint16('byteOrder', { assert: 0xFEFF })
      .uint16('headerSize')
      .uint32('version')
      .uint32('fileSize')
      .uint16('sectionCount')
      .uint16('padding')
      .array('sections', {
        type: new Parser()
          .string('name', { length: 4 })
          .uint32('size')
          .choice('content', {
            tag: 'name',
            choices: {
              'txl1': new Parser().buffer('txl1', { length: 'size' }),
              'pan1': paneParser,
              'pic1': pic1Parser,
              'txt1': txt1Parser
            }
          }),
        length: 'sectionCount'
      });
  }

  private parseTxl1(buffer: Buffer): string[] {
    const textureCount = buffer.readUInt16LE(0);
    const offsets: number[] = [];
    for (let i = 0; i < textureCount; i++) {
      offsets.push(buffer.readUInt32LE(4 + i * 4));
    }

    const textures: string[] = [];
    for (const offset of offsets) {
      const start = offset + 4;
      let end = start;
      while (end < buffer.length && buffer[end] !== 0) {
        end++;
      }
      textures.push(buffer.toString('utf-8', start, end));
    }

    return textures;
  }

  public parse(buffer: Buffer): any {
    const result = this.parser.parse(buffer);

    for (const section of result.sections) {
      if (section.name === 'txl1') {
        section.content = this.parseTxl1(section.content.txl1);
      }
    }

    return result;
  }
}
