import { Loader } from "lucide-react";

type LoaderProps = {
  size?: number;
  fullPage?: boolean;
  speed?: string;
};

const LoadingSpinner = ({ size = 30, fullPage = false }: LoaderProps) => {
  const spinner = (
    <Loader
      className="animate-spin text-muted-foreground"
      style={{ animationDuration: "1.2s" }}
      width={size}
      height={size}
      strokeWidth={3}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
