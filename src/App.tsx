import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CommunityPanel } from "./components/community/CommunityPanel";
import { OpportunitiesPanel } from "./components/opportunities/OpportunitiesPanel";
import { NotificationToast } from "./components/shared/NotificationToast";
import { useCommunityData } from "./hooks/useCommunityData";
import { useOpportunitiesData } from "./hooks/useOpportunitiesData";
import { useNotifications } from "./hooks/useNotifications";

export default function App() {
  const community = useCommunityData();
  const opportunities = useOpportunitiesData();
  const { current, moreCount, notify, dismiss } = useNotifications();

  return (
    <>
      <Navbar />
      <main className="app-main">
        <div className="hub-grid">
          <CommunityPanel
            status={community.status}
            posts={community.posts}
            retry={community.retry}
            addPost={community.addPost}
            toggleLike={community.toggleLike}
            pendingLikeIds={community.pendingLikeIds}
            onPostPublished={() => notify("Your post was published")}
            onLikeFailed={() => notify("Could not update your like. Please try again.")}
          />
          <OpportunitiesPanel
            status={opportunities.status}
            opportunities={opportunities.opportunities}
            retry={opportunities.retry}
            toggleSaved={opportunities.toggleSaved}
            applyTo={opportunities.applyTo}
            pendingApplyIds={opportunities.pendingApplyIds}
            onApplied={(title) => notify(`You applied to ${title}`)}
            onApplyFailed={(title) => notify(`Could not apply to ${title}. Please try again.`)}
          />
        </div>
      </main>
      <Footer />
      {current && <NotificationToast message={current.message} moreCount={moreCount} onDismiss={dismiss} />}
    </>
  );
}
