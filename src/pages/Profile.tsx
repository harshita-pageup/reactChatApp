import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Camera, LockIcon, SkipBack, User2, UserX2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<number>(1);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-xl font-bold p-1">Profile</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { setType(1); }} className={`border py-6 ${type === 1 ? 'bg-accent' : ''}`}>
                  <a className='flex items-center gap-2'>
                    <User2 />
                    Profile
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { setType(2); }} className={`border py-6 ${type === 2 ? 'bg-accent' : ''}`}>
                  <a className='flex items-center gap-2'>
                    <LockIcon />
                    Change Password
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { setType(3); }} className={`border py-6 ${type === 3 ? 'bg-accent' : ''}`}>
                  <a className='flex items-center gap-2'>
                    <UserX2 />
                    Delete Account
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenuButton onClick={() => { navigate('/chats'); }} className='border py-6'>
            <Link to="/chats" className='flex items-center gap-2'>
              <SkipBack />
              Go Back
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <div className='pl-10 pt-20'>
        {type === 1 && <ProfileComponent />}
        {type === 2 && <ChangePasswordComponent />}
        {type === 3 && <DeleteAccountComponent />}
      </div>
    </SidebarProvider>
  )
}

function ProfileComponent() {
  return (
    <div className='flex flex-col gap-4 min-w-lg'>
      <h1 className='text-4xl font-bold mb-5'>Profile</h1>
      <div className='relative w-max'>
        <img src="https://ui-avatars.com/api/?background=222&color=fff&name=HS" className='w-42 h-42 rounded-full' />
        <Button size="icon" className='absolute -bottom-0 -right-0 rounded-full'>
          <Camera />
        </Button>
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="name">Name</label>
        <Input id='name' placeholder='Name' className='w-full' value="Harshita Shrivastava" />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="email">Email</label>
        <Input id='email' placeholder='Email' className='w-full' value="harshita@gmail.com" />
      </div>
      <Button className='w-min mt-2'>Submit</Button>
    </div>
  )
}

function ChangePasswordComponent() {
  return (
    <div className='flex flex-col gap-4 min-w-lg'>
      <h1 className='text-4xl font-bold mb-5'>Change Password</h1>
      <div className='flex flex-col gap-2'>
        <label htmlFor="currentPass">Current Password</label>
        <Input id='currentPass' placeholder='Current Password' className='w-full' />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="newPass">New Password</label>
        <Input id='newPass' placeholder='New Password' className='w-full' />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="confirmPass">Confirm Password</label>
        <Input id='confirmPass' placeholder='Confirm Password' className='w-full' />
      </div>
      <Button className='w-min mt-2'>Submit</Button>
    </div>
  )
}

function DeleteAccountComponent() {
  return (
    <div className='flex flex-col gap-4 max-w-xl'>
      <h1 className='text-4xl font-bold mb-5'>Delete Account</h1>
      <p>Once your account is deleted, all of its resources and data will be permanently deleted.
        Before deleting your account, please download any data or information that you wish to
        retain.</p>
      <Button variant='destructive' className='w-min mt-2'>Delete Account</Button>
    </div>
  )
}

export default Profile