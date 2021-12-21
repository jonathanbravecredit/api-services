import { UserInput } from 'src/api/api.service';

export interface IGetEnrollmentData {
  id: string;
  user: UserInput;
  agencies: {
    transunion: {
      enrollmentKey: string;
      serviceBundleFulfillmentKey: string;
    };
  };
}
