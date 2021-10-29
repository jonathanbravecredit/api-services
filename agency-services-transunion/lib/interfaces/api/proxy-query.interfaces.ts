import { DisputeInput } from 'src/api/api.service';

export interface IProxyQueryGetAppData<T> {
  data: {
    getAppData: T;
  };
}

export interface IGetDataForGetDisputeStatus {
  id: string;
  agencies: {
    transunion: {
      dipsuteEnrollmentKey: string;
      disputeCurrent: DisputeInput;
    };
  };
  user: {
    userAttributes: {
      name: {
        first: string;
        middle: string;
        last: string;
      };
      address: {
        addressOne: string;
        addressTwo: string;
        city: string;
        state: string;
        zip: string;
      };
      phone: {
        primary: string;
      };
      dob: {
        year: string;
        month: string;
        day: string;
      };
      ssn: {
        lastfour: string;
        full: string;
      };
    };
  };
}
