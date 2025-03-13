import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";

type UserAvatarProps = { userProfileOrName: string, size?: 'sm' | 'md' }
const UserAvatar = ({ userProfileOrName, size = 'sm' }: UserAvatarProps) => {
  const nameInitials = useInitials(userProfileOrName);
  const sizeClass = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

  return (
    <Avatar className={`overflow-hidden rounded-full ${sizeClass}`}>
      <AvatarImage src={userProfileOrName} />
      <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
        {nameInitials}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar