
import { useNavigate } from "react-router-dom";

interface ViewingBannerProps {
  viewingUserProfile: any | null;
}

export const ViewingBanner = ({ viewingUserProfile }: ViewingBannerProps) => {
  const navigate = useNavigate();
  
  if (!viewingUserProfile) return null;
  
  return (
    <div className="bg-secondary/20 py-2 px-4 text-center">
      <p className="text-sm">
        You are viewing an individual's dashboard. 
        <button 
          onClick={() => navigate('/dashboard')} 
          className="ml-2 underline font-medium"
        >
          Return to your dashboard
        </button>
      </p>
    </div>
  );
};
