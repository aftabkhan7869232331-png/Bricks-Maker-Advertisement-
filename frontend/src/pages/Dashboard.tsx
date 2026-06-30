import { HomePage } from "../components/home/HomePage";
import type { Campaign } from "../types";

type DashboardPageProps = {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onNavigateToCreate: () => void;
  onToggleStatus: (id: string) => void;
};

export default function DashboardPage(props: DashboardPageProps) {
  return <HomePage {...props} />;
}
