import { Button } from 'react-bootstrap'
import { IoShareSocialOutline } from "react-icons/io5";

const WebShare = () => {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return null;
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: document.title,
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <Button
      variant="dark"
      id="game-unit_share"
      className="game-unit_control d-flex align-items-center justify-content-center border-0"
      onClick={handleShare}
    >
      <IoShareSocialOutline className="fs-6" />
    </Button>
  );
};

export default WebShare;