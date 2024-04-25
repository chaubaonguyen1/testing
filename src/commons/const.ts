import { Campaign } from "./interface";

export const initialCampaign: Campaign = {
  information: {
    name: "",
    describe: "",
  },
  subCampaigns: [
    {
      name: "Sub Campaign 1",
      status: true,
      ads: [
        {
          name: "",
          quantity: 0,
          isChosen: false
        },
        
      ],
    },
  ],
};

export enum EnumCampaign {
  Quantity = 'quantity',
  AdName = 'name'
}