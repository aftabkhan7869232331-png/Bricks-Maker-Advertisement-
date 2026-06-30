import { AdsView } from "../components/AdsView";
import { Campaign } from "../types";

type AdsPageProps = {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  onSaveCampaign: (campaign: Campaign) => void;
  onSelectCampaign: (campaign: Campaign | null) => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
};

export default function AdsPage(props: AdsPageProps) {
  return <AdsView {...props} />;
}
