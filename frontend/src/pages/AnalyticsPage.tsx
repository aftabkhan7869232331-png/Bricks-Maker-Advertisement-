import { AnalyticsView } from "../components/AnalyticsView";
import { Campaign } from "../types";

type AnalyticsPageProps = {
  campaigns: Campaign[];
};

export default function AnalyticsPage(props: AnalyticsPageProps) {
  return <AnalyticsView {...props} />;
}
