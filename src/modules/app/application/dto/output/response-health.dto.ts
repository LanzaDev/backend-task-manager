import { Expose } from "class-transformer";

export class ResponseHealthDTO {
  @Expose()
  status: 'health' | 'unhealthy';

  @Expose()
  cache: 'health' | 'unhealthy';

  @Expose()
  database: 'health' | 'unhealthy';

  @Expose()
  timestamp: string;

  constructor(props: ResponseHealthDTO) {
    Object.assign(this, props);
  }
}
