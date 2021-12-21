export interface IGetEnrollmentData {
  id: string;
  agencies: {
    transunion: {
      enrollmentKey: string;
      serviceBundleFulfillmentKey: string;
    };
  };
}
