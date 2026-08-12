import { G2Wizard } from "../../components/g2-wizard";

export default function SyntheticPilotPage() {
  return <G2Wizard respondent={{ kind: "syntheticPilot", label: "manual-round-trip" }} />;
}
