import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
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

  const ToolTip = ({ children, title }: any) => (
    <OverlayTrigger overlay={<Tooltip>{title}</Tooltip>}>{children}</OverlayTrigger>
  );

  return (
    <ToolTip title="Share">
      <Button
        variant="dark"
        id="game-unit_share"
        className="game-unit_control position-relative py-2 gap-1 d-flex align-items-center justify-content-center border-0"
        onClick={handleShare}
      >
        <IoShareSocialOutline className="fs-6" />
      </Button>
    </ToolTip>
  );
};

export default WebShare;