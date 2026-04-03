import { useEffect, useRef } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

export default function App() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasks();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const allTasks = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const currentPage = data?.pages.at(-1)?.page ?? 1;

  // Sync ?page=N in the URL whenever the fetched page advances
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(currentPage));
    window.history.replaceState(null, "", url.toString());
  }, [currentPage]);

  // Infinite scroll — load next page when sentinel enters viewport
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team Task Tracker</h1>
      </header>

      <main className="app-main">
        <TaskForm />

        <section className="tasks-section">
          <h2>
            Tasks{" "}
            {total > 0 && (
              <span className="task-count">
                ({allTasks.length} of {total})
              </span>
            )}
          </h2>

          {isLoading && <p className="loading-text">Loading tasks…</p>}

          {isError && (
            <p className="error-text">
              {(error as Error)?.message ?? "Failed to load tasks"}
            </p>
          )}

          {!isLoading && <TaskList tasks={allTasks} />}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="load-more-sentinel">
            {isFetchingNextPage && (
              <p className="loading-text">Loading more…</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
