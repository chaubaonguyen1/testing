export interface Ad {
  name: string;
  quantity: number;
  isChosen: boolean;
  [key: string]: any; // Index signature
}

export interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

export interface Campaign {
  information: {
    name: string;
    describe?: string;
  };
  subCampaigns: SubCampaign[];
}
