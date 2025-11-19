export function parseTimeToSeconds(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid time format: ${value}`);

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return amount;
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 60 * 60 * 24;
    default:
      throw new Error(`Invalid unit in time: ${value}`);
  }
}
