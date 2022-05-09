const test = {
  data: {
    transunion: {
      success: true,
      error: { nil: true },
      data: {
        AccountName: 'CC2BraveCredit',
        ErrorResponse: { nil: true },
        RequestKey: 'BC-9adcd773-f78e-4589-a5fb-2cec34a94076',
        ResponseType: 'Success',
        ClientKey: 'c6b9e106-f19c-4f5b-b852-d5d821f608cc',
        PartnerAttributes: { nil: true },
        ProductAttributes: {
          ProductTrendingAttribute: {
            AttributeName: 'TUCVantageScore3V7_1',
            Bureau: 'TransUnion',
            ProductAttributeData: {
              ProductTrendingData: [
                {
                  AttributeDate: '2022-05-01T16:35:44',
                  AttributeStatus: 'Success',
                  AttributeValue: 769,
                  ServiceProductFulfillmentKey: 'c309ea6e-29be-4dfe-aba7-8791a497a20f',
                },
                {
                  AttributeDate: '2022-05-05T10:28:08',
                  AttributeStatus: 'Success',
                  AttributeValue: 769,
                  ServiceProductFulfillmentKey: 'ad5214ac-ee58-4287-9856-45ea00fa1c2a',
                },
              ],
            },
            ServiceBundleCode: 'CC2BraveCreditTUReportV3Score',
            ServiceProduct: 'TUCVantageScore3',
          },
        },
        ProductDisplayToken: '',
      },
    },
  },
};
