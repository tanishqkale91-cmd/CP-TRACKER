import { ProfileSkeleton } from "./Skeletons";

export default function RouteLoading() {
  return <main className="page-shell" aria-busy="true"><ProfileSkeleton label="page" /></main>;
}
