import { useAppSelector } from "@/hooks/useStore";

function LoggedinUser() {
  const { userData } = useAppSelector((state) => state.auth);
  return (
    <div className="border-2 p-1 flex gap-2 rounded-full items-center justify-center bg-[var(--card)]">
      <div className="select-none w-7 h-7 rounded-full bg-foreground text-secondary flex items-center justify-center text-lg font-bold">
        {userData?.name.charAt(0).toUpperCase() || "U"}
      </div>
      <p className="font-semibold text-muted-foreground pr-2">
        @
        {userData?.name
          ? userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
          : "User"}
      </p>
    </div>
  );
}

export default LoggedinUser;
