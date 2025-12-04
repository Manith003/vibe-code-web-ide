import EmptyState from "@/components/ui/EmptyState";
import AddNewButton from "@/features/dashboard/components/AddNewButton";
import AddRepoButton from "@/features/dashboard/components/AddRepoButton";

const page = () => {
  const playgrounds: any[] = [];
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col justify-start items-center px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 w-full px-4">
        <AddNewButton />
        <AddRepoButton />
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No Playgrounds"
            description="You have not created any playgrounds yet."
            imgSrc="/empty.svg"
          />
        ) : (
          <p>You have {playgrounds.length} playgrounds.</p>
        )}
      </div>
    </div>
  );
};

export default page;
