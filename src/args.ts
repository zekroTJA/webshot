import { ArgumentError, ArgumentParser } from 'argparse';

export interface Args {
  page: string[];
  resolution: number[];
  output: string;
  scale: number;
  full: boolean;
}

export function getArgs(): Args {
  const parser = new ArgumentParser({
    description: 'Take full screen shots from web pages.',
  });

  parser.add_argument('page', {
    type: String,
    nargs: '+',
    help: 'URL to the web page(s).',
  });

  parser.add_argument('-r', '--resolution', {
    type: String,
    default: '1920x1080',
    help: 'Screen resolution ({Width}x{Height}) in pixles.',
  });

  parser.add_argument('-s', '--scale', {
    type: Number,
    default: 1,
    help: 'Scale factor (zoom).',
  });

  parser.add_argument('-o', '--output', {
    type: String,
    default: './screenshots',
    help: 'Screenshot file output location.',
  });

  parser.add_argument('-f', '--full', {
    help: 'Whether to screenshot the full page.',
    action: 'store_true',
  });

  const args = parser.parse_args();

  const resolution = (args.resolution as string)
    .toLowerCase()
    .split('x')
    .map((v) => parseInt(v));

  if (resolution.length !== 2) {
    throw new Error('Invalid resolution input format.');
  }

  return {
    page: args.page,
    output: args.output,
    scale: args.scale,
    full: args.full,
    resolution,
  };
}
