import { UserInput } from 'src/api/api.service';

export interface IFulfillWorkerData {
  id: string;
  user: UserInput;
  agencies: {
    transunion: {
      enrollmentKey: string;
      serviceBundleFulfillmentKey: string;
    };
  };
}
