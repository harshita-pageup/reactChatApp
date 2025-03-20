import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Camera, LockIcon, SkipBack, User2, UserX2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import axiosInstance from '@/api/axiosInstance';

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
  const [profileImage, setProfileImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<any>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/authUser`);
        setProfileImage(response.data.data.profile || 'https://ui-avatars.com/api/?background=222&color=fff&name=HS');
        setName(response.data.data.name);
        setEmail(response.data.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // aspect ratio 1:1 for square crop
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      setProfileImage(croppedImageUrl);
      setImageToCrop(null);
    }
  };

  const handleSubmit = async () => {
    const updatedProfile = {
      name,
      email,
      profileImage
    };
    
    try {
      await axiosInstance.post(`/api/updateProfile`, updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className='flex flex-col gap-4 min-w-lg'>
      <h1 className='text-4xl font-bold mb-5'>Profile</h1>
      <div className='relative w-max'>
        <img src={profileImage} className='w-42 h-42 rounded-full object-cover' />
        <Button
          size="icon"
          className='absolute -bottom-0 -right-0 rounded-full'
          onClick={handleImageClick}
        >
          <Camera />
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {imageToCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={imgRef}
                src={imageToCrop}
                onLoad={onImageLoad}
                className="max-h-[70vh]"
              />
            </ReactCrop>
            <div className="flex gap-2 mt-4 justify-end">
              <Button onClick={() => setImageToCrop(null)}>Cancel</Button>
              <Button onClick={getCroppedImage}>Crop & Save</Button>
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <label htmlFor="name">Name</label>
        <Input id='name' placeholder='Name' className='w-full' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="email">Email</label>
        <Input id='email' placeholder='Email' className='w-full' value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button className='w-min mt-2' onClick={handleSubmit}>Submit</Button>
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
  const handleDeleteAccount = async () => {
    try {
      const response = await axiosInstance.delete('/api/deleteAccount');
      if (response.data.success) {
        alert("Account deleted successfully");
        // Redirect to login page or home
        navigate('/');
      } else {
        alert(response.data.message || "Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    }
  };

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