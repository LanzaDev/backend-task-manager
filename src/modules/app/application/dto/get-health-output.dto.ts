export class GetHealthOutputDTO {
  status: 'health' | 'unhealth';
  database: 'health' | 'unhealth';
  timestamp: string;

  constructor(props: GetHealthOutputDTO) {
    Object.assign(this, props);
  }
}
