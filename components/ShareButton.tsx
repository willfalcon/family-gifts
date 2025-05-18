'use client';

import { Check, Copy, Facebook, LinkIcon, Mail, Share2, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export interface ShareButtonProps {
  /**
   * The URL to share. Defaults to current URL if not provided.
   */
  url?: string;

  /**
   * The title of the content being shared
   */
  title?: string;

  /**
   * Optional description for the shared content
   */
  description?: string;

  /**
   * Button variant
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

  /**
   * Button size
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * Whether to show the share text or just the icon
   */
  showText?: boolean;

  /**
   * Custom text to show on the button
   */
  text?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ShareButton({
  url,
  title = 'Check this out!',
  description = 'I thought you might find this interesting.',
  variant = 'outline',
  size = 'sm',
  showText = true,
  text = 'Share',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWebShareAvailable, setIsWebShareAvailable] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Initialize URL and Web Share API availability on client side
    const currentUrl = url || window.location.href;
    setShareUrl(currentUrl);

    const canShare =
      typeof navigator !== 'undefined' && navigator.share !== undefined && navigator.canShare && navigator.canShare({ url: currentUrl });
    setIsWebShareAvailable(canShare);
  }, [url]);

  const handleShare = async () => {
    if (isWebShareAvailable) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        toast('Shared successfully', {
          description: 'Content has been shared',
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setIsDialogOpen(true);
        }
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast('Link copied', {
      description: 'Link has been copied to clipboard',
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const shareViaEmail = () => {
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(`${description}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  return (
    <>
      {isWebShareAvailable ? (
        <Button variant={variant} size={size} onClick={handleShare} className={className}>
          <Share2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
          {showText && text}
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={variant} size={size} className={className}>
              <Share2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
              {showText && text}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
              <DialogDescription>Share this content with others via link or social media.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 pt-4">
              <div className="grid flex-1 gap-2">
                <Input value={shareUrl} readOnly className="w-full" />
              </div>
              <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
              <Button variant="outline" className="flex-1" onClick={shareViaEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareViaTwitter}>
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareViaFacebook}>
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Alternative compact version that uses a dropdown instead of a dialog
export function ShareDropdown({
  url,
  title = 'Check this out!',
  description = 'I thought you might find this interesting.',
  variant = 'outline',
  size = 'sm',
  showText = true,
  text = 'Share',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isWebShareAvailable, setIsWebShareAvailable] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Initialize URL and Web Share API availability on client side
    const currentUrl = url || window.location.href;
    setShareUrl(currentUrl);

    const canShare =
      typeof navigator !== 'undefined' && navigator.share !== undefined && navigator.canShare && navigator.canShare({ url: currentUrl });
    setIsWebShareAvailable(canShare);
  }, [url]);

  const handleShare = async () => {
    if (isWebShareAvailable) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        toast('Shared successfully', {
          description: 'Content has been shared',
        });
      } catch (error) {
        // User cancelled or share failed
        console.error('Error sharing:', error);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast('Link copied', {
      description: 'Link has been copied to clipboard',
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const shareViaEmail = () => {
    const emailSubject = encodeURIComponent(title);
    const emailBody = encodeURIComponent(`${description}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
          {showText && text}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isWebShareAvailable && (
          <>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share via device
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={copyToClipboard}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
