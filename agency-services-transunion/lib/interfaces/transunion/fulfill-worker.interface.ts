export interface IFulfillWorkerData {
  id: string;
  agencies: {
    transunion: {
      enrollmentKey: string;
      serviceBundleFulfillmentKey: string;
    };
  };
}
